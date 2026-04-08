<?php

namespace App\Http\Requests\HR\SubDepartment;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSubDepartmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'department_id' => ['required', 'uuid', 'exists:departments,id'],
            'name'          => ['required', 'string', 'max:100'],
            'code'          => ['nullable', 'string', 'max:20', 'unique:sub_departments,code,' . $this->sub_department->id],
        ];
    }
}
