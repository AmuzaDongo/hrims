<?php

namespace App\Observers;

use App\Models\HR\Employee;

class EmployeeObserver
{
    public function created(Employee $employee): void
    {
        $employee->profile()->create([]);
    }
}