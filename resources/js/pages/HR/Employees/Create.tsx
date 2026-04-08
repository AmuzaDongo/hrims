import { Head } from "@inertiajs/react";

import { EmployeeForm } from "@/components/employees/employee-form";
import AppLayout from "@/layouts/app-layout";

interface Props {
  departments: { id: string; name: string }[];
  subDepartments: { id: string; name: string; department_id: string }[];
  positions: { id: string; title: string; department_id: string }[];
}

export default function CreateEmployee({ departments, subDepartments, positions }: Props) {

  return (
    <AppLayout>
      <Head title="Add New Employee" />

      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Employee</h1>
          <p className="text-muted-foreground mt-2">
            Enter the employee's details below. All required fields are marked with *
          </p>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <EmployeeForm
            departments={departments}
            subDepartments={subDepartments}
            positions={positions}
            initialData={null}  
          />
        </div>
      </div>
    </AppLayout>
  );
}