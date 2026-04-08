<?php

namespace App\Http\Requests\HR\Activity;

use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date'  => ['required', 'date'],
            'end_date'    => ['nullable', 'date', 'after_or_equal:start_date'],
            'status'      => ['required', 'in:draft,upcoming,ongoing,completed,cancelled'],
            'type'        => ['required', 'in:assessment,award_ceremony,training,meeting,event,other'],
            'venue'       => ['nullable', 'string', 'max:255'],
            'address'     => ['nullable', 'string'],
            'budget'      => ['nullable', 'numeric', 'min:0'],
            'actual_cost' => ['nullable', 'numeric', 'min:0'],
            'lead_id'     => ['required', 'exists:employees,id'],
        ];
    }
}