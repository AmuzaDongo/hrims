<?php

namespace App\Http\Requests\Assessment\AssessmentCategory;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;


class StoreAssessmentCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Implement authorization logic as needed
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:100', 'unique:assessment_categories,name'],
            'code'        => ['nullable', 'string', 'max:20', 'unique:assessment_categories,code'],
            'metadata'    => ['nullable', 'array'],
        ];
    }
}