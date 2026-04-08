<?php

namespace App\Http\Requests\HR\Department;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:100',
                'unique:departments,name,' . $this->department->id
            ],

            'code' => [
                'nullable',
                'string',
                'max:20',
                'unique:departments,code,' . $this->department->id
            ],

            'description' => ['nullable', 'string'],

            'parent_id' => [
                'nullable',
                'exists:departments,id'
            ],

            'head_id' => [
                'nullable',
                'exists:employees,id'
            ],

            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
