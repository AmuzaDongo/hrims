"use client";

import { router } from "@inertiajs/react";
import { format, parseISO, isValid } from "date-fns";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import employees from "@/wayfinder/routes/employees";

interface EmployeeFormProps {
  departments: { id: string; name: string }[];
  subDepartments: { id: string; name: string; department_id: string }[];
  positions: { id: string; title: string; department_id: string }[];
  initialData?: {
    id?: string;
    employee_number?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    date_of_birth?: string;
    hire_date?: string;
    probation_end_date?: string;
    termination_date?: string;
    employment_type?: string;
    status?: string;
    department_id?: string;
    sub_department_id?: string;
    position_id?: string;
  } | null;
  isEdit?: boolean;
}

export function EmployeeForm({
  departments,
  subDepartments,
  positions,
  initialData = null,
  isEdit = false,
}: EmployeeFormProps) {
  // Yup validation schema
  const validationSchema = Yup.object({
    employee_number: Yup.string().required("Employee number is required"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    hire_date: Yup.date().required("Hire date is required"),
    department_id: Yup.string().required("Department is required"),
    employment_type: Yup.string().required("Employment type is required"),
    status: Yup.string().required("Status is required"),
    // optional fields
    middle_name: Yup.string().nullable(),
    date_of_birth: Yup.date().nullable(),
    probation_end_date: Yup.date().nullable(),
    termination_date: Yup.date().nullable(),
    sub_department_id: Yup.string().nullable(),
    position_id: Yup.string().nullable(),
  });

  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsed = parseISO(date); // handles ISO from Laravel

    return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : "";
  };

  return (
    <Formik
      initialValues={{
        employee_number: initialData?.employee_number || "",
        first_name: initialData?.first_name || "",
        middle_name: initialData?.middle_name || "",
        last_name: initialData?.last_name || "",
        date_of_birth: formatDate(initialData?.date_of_birth),
        hire_date: formatDate(initialData?.hire_date),
        probation_end_date: formatDate(initialData?.probation_end_date),
        termination_date: formatDate(initialData?.termination_date),
        employment_type: initialData?.employment_type || "permanent",
        status: initialData?.status || "active",
        department_id: initialData?.department_id || "",
        sub_department_id: initialData?.sub_department_id || "",
        position_id: initialData?.position_id || "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const isEditMode = !!initialData?.id;
        const url = isEditMode
          ? employees.update(initialData!.id!)
          : employees.store();

        if (isEditMode) {
          router.put(url, values, {
            onSuccess: () => {
              toast.success("Employee updated successfully!");
              router.visit(employees.index());
            },
            onError: (errors) => {
              console.error(errors);
              toast.error("Failed to update employee.");
            },
            onFinish: () => setSubmitting(false),
          });
        } else {
          router.post(url, values, {
            onSuccess: () => {
              resetForm();
              toast.success("Employee created successfully!");
              router.visit(employees.index());
            },
            onError: (errors) => {
              console.error(errors);
              toast.error("Failed to create employee.");
            },
            onFinish: () => setSubmitting(false),
          });
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-8">
          {/* Employee Number & Employment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="employee_number">
                Employee Number <span className="text-red-500">*</span>
              </Label>
              <Field
                as={Input}
                id="employee_number"
                name="employee_number"
                placeholder="e.g. EMP-00123"
              />
              <ErrorMessage
                name="employee_number"
                component="p"
                className="text-sm text-destructive mt-1"
              />
            </div>

            <div>
              <Label htmlFor="employment_type">
                Employment Type <span className="text-red-500">*</span>
              </Label>
              <Field name="employment_type">
                {({ field }: { field: { value: string } }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => setFieldValue("employment_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </Field>
              <ErrorMessage
                name="employment_type"
                component="p"
                className="text-sm text-destructive mt-1"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="first_name">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Field
                as={Input}
                id="first_name"
                name="first_name"
              />
              <ErrorMessage name="first_name" component="p" className="text-sm text-destructive mt-1" />
            </div>

            <div>
              <Label htmlFor="middle_name">Middle Name</Label>
              <Field as={Input} id="middle_name" name="middle_name" />
            </div>

            <div>
              <Label htmlFor="last_name">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Field as={Input} id="last_name" name="last_name" />
              <ErrorMessage name="last_name" component="p" className="text-sm text-destructive mt-1" />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Field as={Input} id="date_of_birth" name="date_of_birth" type="date" />
            </div>

            <div>
              <Label htmlFor="hire_date">
                Hire Date <span className="text-red-500">*</span>
              </Label>
              <Field as={Input} id="hire_date" name="hire_date" type="date" />
              <ErrorMessage name="hire_date" component="p" className="text-sm text-destructive mt-1" />
            </div>

            <div>
              <Label htmlFor="probation_end_date">Probation End Date</Label>
              <Field as={Input} id="probation_end_date" name="probation_end_date" type="date" />
            </div>
          </div>

          {/* Department → Sub-Department → Position */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="department_id">Department</Label>
              <Field name="department_id">
                {({ field }: { field: { value: string } }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => setFieldValue("department_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
              <ErrorMessage name="department_id" component="p" className="text-sm text-destructive mt-1" />
            </div>

            <div>
              <Label htmlFor="sub_department_id">Sub-Department</Label>
              <Field name="sub_department_id">
                {({ field }: { field: { value: string } }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => setFieldValue("sub_department_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-department" />
                    </SelectTrigger>
                    <SelectContent>
                      {subDepartments
                        .filter((sub) => sub.department_id === values.department_id)
                        .map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            </div>

            <div>
              <Label htmlFor="position_id">Position</Label>
              <Field name="position_id">
                {({ field }: { field: { value: string } }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => setFieldValue("position_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions
                        .filter((pos) => pos.department_id === values.department_id)
                        .map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Field name="status">
              {({ field }: { field: { value: string } }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => setFieldValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Field>
          </div>

          <div className="flex justify-end gap-4 pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit(employees.index())}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Employee"
                : "Create Employee"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}