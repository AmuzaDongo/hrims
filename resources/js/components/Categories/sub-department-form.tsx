"use client";

import { router } from "@inertiajs/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import subDepartments from "@/wayfinder/routes/sub-departments";

interface SubDepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: { id: string; name: string }[];
  initialData?: {
    id?: string;
    name: string;
    code: string;
    department_id: string;
  } | null;
}

export function SubDepartmentForm({
  open,
  onOpenChange,
  departments,
  initialData = null,
}: SubDepartmentFormProps) {
  const isEdit = !!initialData?.id;

  // ✅ Yup Validation
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    code: Yup.string().nullable(),
    department_id: Yup.string().required("Department is required"),
  });

  // ✅ Formik Setup
  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      department_id: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      const url = isEdit
        ? router(subDepartments.update(), initialData?.id)
        : router(subDepartments.store());

      const method = isEdit ? router.put : router.post;

      method(url, values, {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
        onError: () => {
          console.error("Form submission failed");
        },
        onFinish: () => setSubmitting(false),
      });
    },
  });

  // ✅ Populate form when editing
  useEffect(() => {
    if (open && initialData) {
      formik.setValues({
        name: initialData.name || "",
        code: initialData.code || "",
        department_id: initialData.department_id || "",
      });
    }

    if (open && !initialData) {
      formik.resetForm();
    }
  }, [open, initialData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Sub-Department" : "Add New Sub-Department"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the sub-department details below."
              : "Fill in the details to create a new sub-department."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5 pt-4">
          {/* Department */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Department <span className="text-red-500">*</span>
            </Label>

            <Select
              value={formik.values.department_id}
              onValueChange={(value) =>
                formik.setFieldValue("department_id", value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select parent department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formik.touched.department_id && formik.errors.department_id && (
              <p className="col-span-4 text-sm text-destructive">
                {formik.errors.department_id}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="col-span-3"
              placeholder="e.g. Recruitment"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="col-span-4 text-sm text-destructive">
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Code */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Code</Label>
            <Input
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="col-span-3"
              placeholder="e.g. RECR"
            />
            {formik.touched.code && formik.errors.code && (
              <p className="col-span-4 text-sm text-destructive">
                {formik.errors.code}
              </p>
            )}
          </div>

          <DialogFooter className="sm:justify-start gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Sub-Department"
                : "Create Sub-Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}