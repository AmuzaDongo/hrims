<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\InventoryItem;
use App\Models\ProcurementRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user?->getRoleNames()->first() ?? 'viewer';


        $stats = [
            'totalItems'       => InventoryItem::where('status', 'active')->count() ?? 0,
            'pendingRequests'  => ProcurementRequest::where('status', 'pending')->count() ?? 0,
            'lowStockAlerts'   => InventoryItem::whereColumn('current_stock', '<=', 'reorder_level')->count() ?? 0,
            'assetsTracked'    => Asset::whereNotNull('qr_code')->count() ?? 0,

            'monthlyTrends'    => $this->getMonthlyInventoryTrends(),

            'assetStatus'      => $this->getAssetStatusDistribution(),
        ];

        $recentActivities = Activity::with('causer')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($activity) => [
                'id'     => $activity->id,
                'action' => $activity->description ?? 'System action performed',
                'user'   => $activity->causer?->name ?? 'System',
                'time'   => $activity->created_at->diffForHumans(),
                'status' => $activity->properties['status'] ?? ($activity->event === 'created' ? 'completed' : 'info'),
            ])
            ->toArray();

        if (empty($recentActivities)) {
            $recentActivities = [
                [
                    'id'     => 0,
                    'action' => 'System initialized – welcome!',
                    'user'   => 'System',
                    'time'   => 'Just now',
                    'status' => 'completed',
                ]
            ];
        }

        return Inertia::render('Dashboard', [
            'stats'            => $stats,
            'recentActivities' => $recentActivities,
            'user'             => [
                'name' => $user->name,
                'role' => $role,
                'email' => $user->email,
            ],
        ]);
    }

    private function getMonthlyInventoryTrends(): array
    {
        $months = collect(range(5, 0))
            ->map(fn ($i) => Carbon::now()->subMonthsNoOverflow($i)->format('M Y'))
            ->toArray();

        $data = InventoryItem::selectRaw("DATE_FORMAT(created_at, '%b %Y') as month, SUM(value ?? current_stock * unit_price) as total")
            ->where('created_at', '>=', Carbon::now()->subMonthsNoOverflow(6))
            ->groupBy('month')
            ->pluck('total', 'month')
            ->toArray();

        return collect($months)->map(fn ($month) => [
            'month' => $month,
            'value' => $data[$month] ?? 0,
        ])->toArray();
    }

    private function getAssetStatusDistribution(): array
    {
        $counts = Asset::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return [
            ['name' => 'Active',      'value' => $counts['active']      ?? 0],
            ['name' => 'Maintenance', 'value' => $counts['maintenance'] ?? 0],
            ['name' => 'Retired',     'value' => $counts['retired']     ?? 0],
            ['name' => 'Lost/Damaged','value' => $counts['lost']        ?? 0],
        ];
    }
}