import { Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import { ArrowLeft, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import employees from "@/wayfinder/routes/employees";


interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  email_verified_at?: string | null;
  created_at: string;
}

interface Employee {
  id: string;
  employee_number: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  date_of_birth: string | null;
  hire_date: string;
  probation_end_date: string | null;
  termination_date: string | null;
  employment_type: string;
  status: string;
  department: { id: string; name: string } | null;
  sub_department: { id: string; name: string } | null;
  position: { id: string; title: string } | null;
  user: User | null;
  custom_fields: { field: { value: string } };
}

interface Props {
  employee: Employee;
}

export default function ShowEmployee({ employee }: Props) {
  const fullName = `${employee.first_name} ${employee.middle_name || ""} ${employee.last_name}`.trim();

  const statusColor = {
    active: "bg-green-100 text-green-800 border-green-300",
    inactive: "bg-gray-100 text-gray-800 border-gray-300",
    on_leave: "bg-yellow-100 text-yellow-800 border-yellow-300",
    terminated: "bg-red-100 text-red-800 border-red-300",
  }[employee.status] || "bg-gray-100 text-gray-800 border-gray-300";

  const user = employee.user;

  return (
    <AppLayout>
      <Head title={`Employee: ${fullName}`} />

      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={employees.index()}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
              <p className="text-muted-foreground mt-1">
                {employee.employee_number ? `ID: ${employee.employee_number}` : "No employee number"} <span className={user && user.email ? "" : "text-red-600"}>{user && user.email ? ` | Email: ${user.email}` : " | Employee has no user account?"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className={statusColor}>
              {employee.status.charAt(0).toUpperCase() + employee.status.slice(1).replace("_", " ")}
            </Badge>
            <Button asChild>
              <Link href={employees.edit(employee.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Employee
              </Link>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">First Name</p>
              <p className="mt-1">{employee.first_name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Middle Name</p>
              <p className="mt-1">{employee.middle_name || "—"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Name</p>
              <p className="mt-1">{employee.last_name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
              <p className="mt-1">
                {employee.date_of_birth
                  ? format(new Date(employee.date_of_birth), "MMMM d, yyyy")
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Employee Number</p>
              <p className="mt-1">{employee.employee_number || "—"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Employment Type</p>
              <p className="mt-1 capitalize">{employee.employment_type}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="mt-1 capitalize">{employee.status.replace("_", " ")}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Hire Date</p>
              <p className="mt-1">{format(new Date(employee.hire_date), "MMMM d, yyyy")}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Probation End Date</p>
              <p className="mt-1">
                {employee.probation_end_date
                  ? format(new Date(employee.probation_end_date), "MMMM d, yyyy")
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Termination Date</p>
              <p className="mt-1">
                {employee.termination_date
                  ? format(new Date(employee.termination_date), "MMMM d, yyyy")
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Department</p>
              <p className="mt-1">{employee.department?.name || "—"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Sub-Department</p>
              <p className="mt-1">{employee.sub_department?.name || "—"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Position</p>
              <p className="mt-1">{employee.position?.title || "—"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Fields (if any) */}
        {employee.custom_fields && Object.keys(employee.custom_fields).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(employee.custom_fields).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="mt-1">
                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}