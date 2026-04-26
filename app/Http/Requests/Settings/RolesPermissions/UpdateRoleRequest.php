<?php

namespace App\Http\Requests\Settings\RolesPermissions;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $roleId = $this->route('roles_permission');
        return [
            'name'       => ['required', 'string', 'max:255', 'unique:roles,name,' . $roleId],
        ];
    }
}