<?php

namespace App\Http\Requests\Assessment\AssessmentSeries;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssessmentSeriesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'       => ['required', 'string', 'max:255'],
            'year' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ];
    }
}