"use client";

import { router } from "@inertiajs/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import departments from "@/wayfinder/routes/departments";

interface Department {
  id?: string;
  name: string;
  code: string | null;
  description: string | null;
  parent?: { id: string; name: string };
  head?: { id: string; first_name: string; last_name: string };
  is_active: boolean;
}

interface DepartmentFormProps {
  initialData?: Department;
  parents: { id: string; name: string }[];
  employees: { id: string; first_name: string; last_name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepartmentForm({
  initialData,
  parents,
  employees,
  open,
  onOpenChange,
}: DepartmentFormProps) {
  const isEditMode = !!initialData?.id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    code: Yup.string(),
    description: Yup.string(),
    parent_id: Yup.string(),
    head_id: Yup.string(),
    is_active: Yup.boolean(),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-131.25">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Department" : "Add Department"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the department details below."
              : "Create a new department. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            name: initialData?.name || "",
            code: initialData?.code || "",
            description: initialData?.description || "",
            parent_id: initialData?.parent?.id || "",
            head_id: initialData?.head?.id || "",
            is_active: initialData?.is_active ?? true,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const url = isEditMode
              ? departments.update(initialData!.id!)
              : departments.store();

            if (isEditMode) {
              router.put(url, values, {
                onSuccess: () => {
                  toast.success("Department updated successfully!");
                  onOpenChange(false);
                },
                onError: (errors) => {
                  console.error(errors);
                  toast.error("Failed to update department.");
                },
                onFinish: () => setSubmitting(false),
              });
            } else {
              router.post(url, values, {
                onSuccess: () => {
                  resetForm();
                  toast.success("Department created successfully!");
                  onOpenChange(false);
                },
                onError: (errors) => {
                  console.error(errors);
                  toast.error("Failed to create department.");
                },
                onFinish: () => setSubmitting(false),
              });
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Human Resources"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Field
                  as={Input}
                  id="code"
                  name="code"
                  placeholder="HRD-01"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="code"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Description */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Department description..."
                  className="col-span-3"
                />
              </div>

              {/* Parent Department */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parent_id" className="text-right">
                  Parent Department
                </Label>
                <Select
                  value={values.parent_id || ""}
                  onValueChange={(value) => setFieldValue("parent_id", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select parent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent_id">None</SelectItem>
                    {parents.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department Head */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="head_id" className="text-right">
                  Department Head
                </Label>
                <Select
                  value={values.head_id || ""}
                  onValueChange={(value) => setFieldValue("head_id", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select head (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="head_id">None</SelectItem>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.first_name} {e.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Active Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_active" className="text-right">
                  Active
                </Label>
                <Field
                  type="checkbox"
                  name="is_active"
                  checked={values.is_active}
                  onChange={() => setFieldValue("is_active", !values.is_active)}
                  className="col-span-3 h-4 w-4"
                />
              </div>

              {/* Actions */}
              <DialogFooter className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isEditMode ? "Update Department" : "Create Department"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}