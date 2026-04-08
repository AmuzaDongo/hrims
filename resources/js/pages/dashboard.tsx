import { Head, Link, usePage } from '@inertiajs/react';
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

// ────────────────────────────────────────────────
// Types (expand as needed with real Inertia props)
interface DashboardProps {
  stats: {
    totalItems: number;
    pendingRequests: number;
    lowStockAlerts: number;
    assetsTracked: number;
    monthlyTrends: Array<{ month: string; value: number }>;
    assetStatus: Array<{ name: string; value: number }>;
  };
  recentActivities: Array<{
    id: number;
    action: string;
    user: string;
    time: string;
    status: 'pending' | 'completed' | 'alert';
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// ────────────────────────────────────────────────
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
];

export default function Dashboard({ 
  stats = {
    totalItems: 456,
    pendingRequests: 50,
    lowStockAlerts: 60,
    assetsTracked: 12,
    monthlyTrends: [],
    assetStatus: [],
  }, 
  recentActivities = [] 
}: DashboardProps) {
  const { auth } = usePage().props as unknown as { auth?: { user?: { name: string; role: string } } };
  const user = auth?.user || { name: 'Guest', role: 'viewer' }; // fallback

  const role = user.role?.toLowerCase() || 'viewer';

  const {
    totalItems = 0,
    pendingRequests = 0,
    lowStockAlerts = 0,
    assetsTracked = 0,
  } = stats;

  // Quick actions by role (expandable)
  const quickActions = {
    admin: [
      { label: 'Manage Users', icon: Users, href: '/users' },
      { label: 'View Reports', icon: BarChart3, href: '/reports' },
      { label: 'System Settings', icon: FileText, href: '/settings' },
    ],
    procurement_officer: [
      { label: 'Create Procurement Request', icon: ShoppingCart, href: '/procurement/create' },
      { label: 'Check Stock Levels', icon: Package, href: '/inventory' },
      { label: 'Review Pending Orders', icon: Clock, href: '/orders/pending' },
    ],
    store_manager: [
      { label: 'Update Inventory', icon: Package, href: '/inventory/update' },
      { label: 'Review Low Stock', icon: AlertTriangle, href: '/inventory/low-stock' },
      { label: 'Generate Stock Report', icon: TrendingUp, href: '/reports/stock' },
    ],
    verification_officer: [
      { label: 'Review Pending Requests', icon: CheckCircle2, href: '/requests/pending' },
      { label: 'Verify Assets', icon: BadgeCheck, href: '/assets/verify' },
    ],
    approval_officer: [
      { label: 'Approve Requests', icon: CheckCircle2, href: '/approvals' },
      { label: 'View Approval History', icon: Clock, href: '/approvals/history' },
    ],
    hr_manager: [
      { label: 'Manage Employees', icon: Users, href: '/hr/employees' },
      { label: 'Process Payroll', icon: TrendingUp, href: '/payroll' },
    ],
    assessor: [
      { label: 'Score Assessments', icon: BarChart3, href: '/assessments' },
      { label: 'View Candidate Profiles', icon: Users, href: '/candidates' },
    ],
    default: [
      { label: 'View My Tasks', icon: Clock, href: '/tasks' },
    ],
  };

  const actions = quickActions[role as keyof typeof quickActions] || quickActions.default;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              Overview of inventory, assets, and key activities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="capitalize">
              {role.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
                title: 'Total Items',
                value: totalItems?.toLocaleString() ?? '0',
                description: 'Active stock',
                icon: Package,
                color: 'text-blue-600 dark:text-blue-400',
            },
            {
                title: 'Pending Requests',
                value: pendingRequests?.toLocaleString() ?? '0',
                description: 'Awaiting approval',
                icon: Clock,
                color: 'text-yellow-600 dark:text-yellow-400',
            },
            {
                title: 'Low Stock Alerts',
                value: lowStockAlerts?.toLocaleString() ?? '0',
                description: 'Below reorder',
                icon: AlertTriangle,
                color: 'text-red-600 dark:text-red-400',
            },
            {
                title: 'Assets Tracked',
                value: assetsTracked?.toLocaleString() ?? '0',
                description: 'With QR codes',
                icon: CheckCircle2,
                color: 'text-green-600 dark:text-green-400',
            },
          ].map((stat, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Monthly Trends - Bar Chart */}
          <Card className="col-span-4 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Inventory Trends</CardTitle>
              <CardDescription>Stock value over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pb-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Asset Status - Pie Chart */}
          <Card className="col-span-3 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Asset Status</CardTitle>
              <CardDescription>Current distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-4">
              <ResponsiveContainer width="100%" height={240}>
                <RePieChart>
                  <Pie
                    data={stats.assetStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.assetStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities + Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Activities */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Activities</CardTitle>
              <CardDescription>Latest updates across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No recent activities
                  </p>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium leading-none">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                      <Badge
                        variant={
                          activity.status === 'completed'
                            ? 'default'
                            : activity.status === 'alert'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Frequently used tasks for your role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {actions.map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 text-left"
                    asChild
                  >
                    <Link href={action.href}>
                      <action.icon className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
                      <span>{action.label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}