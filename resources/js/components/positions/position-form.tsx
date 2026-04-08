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
import positions from "@/wayfinder/routes/positions";

interface Position {
  id?: string;
  title: string;
  code: string | null;
  description: string | null;
  department?: { id: string; name: string };
  base_salary: number | null;
  is_active: boolean;
}

interface PositionFormProps {
  initialData?: Position;
  departments: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PositionForm({
  initialData,
  departments,
  open,
  onOpenChange,
}: PositionFormProps) {
  const isEditMode = !!initialData?.id;

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    code: Yup.string(),
    description: Yup.string(),
    base_salary: Yup.number().nullable(),
    department_id: Yup.string(),
    is_active: Yup.boolean(),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-131.25">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Position" : "Add Position"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the position details below."
              : "Create a new position. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            title: initialData?.title || "",
            code: initialData?.code || "",
            description: initialData?.description || "",
            base_salary: initialData?.base_salary || null,
            department_id: initialData?.department?.id || "",
            is_active: initialData?.is_active ?? true,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const url = isEditMode
              ? positions.update(initialData!.id!)
              : positions.store();

            if (isEditMode) {
              router.put(url, values, {
                onSuccess: () => {
                  toast.success("Position updated successfully!");
                  onOpenChange(false);
                },
                onError: (errors) => {
                  console.error(errors);
                  toast.error("Failed to update position.");
                },
                onFinish: () => setSubmitting(false),
              });
            } else {
              router.post(url, values, {
                onSuccess: () => {
                  resetForm();
                  toast.success("Position created successfully!");
                  onOpenChange(false);
                },
                onError: (errors) => {
                  console.error(errors);
                  toast.error("Failed to create position.");
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
                  Title
                </Label>
                <Field
                  as={Input}
                  id="title"
                  name="title"
                  placeholder="Data Analyst"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="title"
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
                <Label htmlFor="department_id" className="text-right">
                  Department
                </Label>
                <Select
                  value={values.department_id || ""}
                  onValueChange={(value) => setFieldValue("department_id", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="department_id">None</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="base_salary" className="text-right">
                  Base Salary
                </Label>
                <Field
                  as={Input}
                  type="number"
                  id="base_salary"
                  name="base_salary"
                  placeholder="0.00"
                  className="col-span-3"
                />
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