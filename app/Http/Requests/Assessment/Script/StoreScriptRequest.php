<?php

namespace App\Http\Requests\Assessment\Paper;

use Illuminate\Foundation\Http\FormRequest;

class StoreScriptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'paper_id' => 'required|uuid|exists:papers,id',
            'center_origin' => 'required|string|max:255',
            'barcode' => 'nullable|string|max:255',
            'status' => 'required|string|in:pending,processing,completed',
            'current_location' => 'required|string|max:255'
        ];
    }
}