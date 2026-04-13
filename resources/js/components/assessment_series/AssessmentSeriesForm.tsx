"use client";

import { router } from "@inertiajs/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import assessmentSeries from "@/routes/assessment-series";

interface AssessmentSeries {
  id?: string;
  name: string;
  year: string;
  status: string; // "active" | "inactive"
}

interface AssessmentSeriesFormProps {
  initialData?: AssessmentSeries;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssessmentSeriesForm({
  initialData,
  open,
  onOpenChange,
}: AssessmentSeriesFormProps) {
  const isEditMode = !!initialData?.id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    year: Yup.string().nullable(),
    status: Yup.boolean().required(),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-131.25">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? "Edit Assessment Series"
              : "Add Assessment Series"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the assessment series details below."
              : "Create a new assessment series. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            name: initialData?.name || "",
            year: initialData?.year || "",
            status: initialData?.status === "active", // ✅ FIXED
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const url = isEditMode
              ? assessmentSeries.update(initialData!.id!)
              : assessmentSeries.store();

            const formData = new FormData();
            formData.append("name", values.name);

            if (values.year) {
              formData.append("year", values.year);
            }

            // ✅ convert boolean → string
            formData.append(
              "status",
              values.status ? "active" : "inactive"
            );

            if (isEditMode) {
              formData.append("_method", "PUT");

              router.post(url, formData, {
                forceFormData: true,
                onSuccess: () => {
                  toast.success(
                    "Assessment series updated successfully!"
                  );
                  onOpenChange(false);
                },
                onError: () => {
                  toast.error(
                    "Failed to update assessment series."
                  );
                },
                onFinish: () => setSubmitting(false),
              });
            } else {
              router.post(url, formData, {
                forceFormData: true,
                onSuccess: () => {
                  resetForm();
                  toast.success(
                    "Assessment series created successfully!"
                  );
                  onOpenChange(false);
                },
                onError: () => {
                  toast.error(
                    "Failed to create assessment series."
                  );
                },
                onFinish: () => setSubmitting(false),
              });
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="eg: May-June 2024"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Year */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">
                  Year
                </Label>
                <Field
                  as={Input}
                  id="year"
                  name="year"
                  placeholder="eg: 2024"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="year"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Active
                </Label>

                {/* ✅ CLEAN FORMIK CHECKBOX */}
                <Field name="status">
                  {({ field, form }: any) => (
                    <input
                      type="checkbox"
                      id="status"
                      checked={field.value}
                      onChange={(e) =>
                        form.setFieldValue(
                          "status",
                          e.target.checked
                        )
                      }
                      className="col-span-3 h-4 w-4"
                    />
                  )}
                </Field>

                <ErrorMessage
                  name="status"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Actions */}
              <DialogFooter className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isEditMode
                    ? "Update Assessment Series"
                    : "Create Assessment Series"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}