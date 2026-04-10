<?php

namespace App\Http\Requests\Assessment\AssessmentCategory;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAssessmentCategoryRequest extends FormRequest
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
                'unique:assessment_categories,name,' . $this->assessmentCategory->id
            ],

            'code' => [
                'nullable',
                'string',
                'max:20',
                'unique:assessment_categories,code,' . $this->assessmentCategory->id
            ],
        ];
    }
}
