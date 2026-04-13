<?php

namespace App\Http\Requests\Assessment\AssessmentSeries;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssessmentSeriesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'       => ['required', 'string', 'max:255', 'unique:assessment_series,name'],
            'year' => ['nullable', 'string', 'max:255', 'unique:assessment_series,year'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}