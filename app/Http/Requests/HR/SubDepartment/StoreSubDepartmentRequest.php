<?php

namespace App\Http\Requests\HR\SubDepartment;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSubDepartmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'department_id' => ['required', 'exists:departments,id'],
            'name'          => ['required', 'string', 'max:100'],
            'code'          => ['nullable', 'string', 'max:20', 'unique:sub_departments,code'],
        ];
    }

    public function messages(): array
    {
        return [
            'department_id.required' => 'Please select a parent department.',
            'department_id.exists'   => 'The selected department does not exist.',
        ];
    }
}
