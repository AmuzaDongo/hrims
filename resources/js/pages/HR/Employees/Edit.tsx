import { Head } from "@inertiajs/react";

import { EmployeeForm } from "@/components/employees/employee-form";
import AppLayout from "@/layouts/app-layout";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department_id: string;
  sub_department_id: string;
  position_id: string;
  [key: string]: string | number | boolean;
}

interface Props {
  departments: { id: string; name: string }[];
  subDepartments: { id: string; name: string; department_id: string }[];
  positions: { id: string; title: string; department_id: string }[];
  employee: Employee;
}

export default function EditEmployee({ departments, subDepartments, positions, employee }: Props) {
  return (
    <AppLayout>
      <Head title="Add New Employee" />

      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Employee</h1>
          <p className="text-muted-foreground mt-2">
            Update the employee's details below. All required fields are marked with *
          </p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <EmployeeForm
            departments={departments}
            subDepartments={subDepartments}
            positions={positions}
            initialData={employee}  
            isEdit={true}
          />
        </div>
      </div>
    </AppLayout>
  );
}