<?php

namespace App\Http\Requests\HR\Employee;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_number' => ['required', 'string', 'max:50', 'unique:employees,employee_number,' . $this->employee->id],
            'department_id'     => ['nullable', 'uuid', 'exists:departments,id'],
            'sub_department_id' => ['nullable', 'uuid', 'exists:sub_departments,id'],
            'position_id'       => ['nullable', 'uuid', 'exists:positions,id'],
            'first_name'        => ['required', 'string', 'max:100'],
            'middle_name'       => ['nullable', 'string', 'max:100'],
            'last_name'         => ['required', 'string', 'max:100'],
            'date_of_birth'     => ['nullable', 'date'],
            'hire_date'         => ['required', 'date'],
            'probation_end_date' => ['nullable', 'date', 'after_or_equal:hire_date'],
            'termination_date'  => ['nullable', 'date', 'after_or_equal:probation_end_date'],
            'employment_type'   => ['required', 'in:permanent,contract,intern,consultant'],
            'status'            => ['required', 'in:active,inactive,on_leave,terminated'],
            'custom_fields'     => ['nullable', 'array']
        ];
    }
}
