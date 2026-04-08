<?php

namespace App\Http\Requests\HR\Position;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePositionRequest extends FormRequest
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
            'title'         => ['required', 'string', 'max:100'],
            'code'          => ['nullable', 'string', 'max:20', 'unique:positions,code'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'description'   => ['nullable', 'string'],
            'base_salary'   => ['nullable', 'numeric', 'min:0'],
            'is_active'     => ['boolean'],
            'metadata'      => ['nullable', 'array'],
        ];
    }
}
