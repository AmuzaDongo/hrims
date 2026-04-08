<?php

namespace App\Http\Requests\HR\Department;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;


class StoreDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Implement authorization logic as needed
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:100', 'unique:departments,name'],
            'code'        => ['nullable', 'string', 'max:20', 'unique:departments,code'],
            'description' => ['nullable', 'string'],
            'parent_id'   => ['nullable', 'exists:departments,id'],
            'head_id'     => ['nullable', 'exists:employees,id'],
            'metadata'    => ['nullable', 'array'],
        ];
    }
}