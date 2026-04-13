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
import scripts from "@/routes/scripts";

interface Script {
  id?: string;
  center_origin: string;
  status: string;
  current_location: string;
  paper?: { id: string; name: string, code: string };
}

interface ScriptFormProps {
  initialData?: Script;
  papers: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScriptForm({
  initialData,
  papers,
  open,
  onOpenChange,
}: ScriptFormProps) {
  const isEditMode = !!initialData?.id;

  const validationSchema = Yup.object().shape({
    center_origin: Yup.string().required("Center origin is required"),
    status: Yup.string().required("Status is required"),
    current_location: Yup.string().required("Current location is required"),
    paper_id: Yup.string().required("Paper is required"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-131.25">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Script" : "Add Script"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the script details below."
              : "Create a new script. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            center_origin: initialData?.center_origin || "",
            status: initialData?.status || "",
            current_location: initialData?.current_location || "",
            paper_id: initialData?.paper?.id || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const url = isEditMode
              ? scripts.update(initialData!.id!)
              : scripts.store();

            if (isEditMode) {
              router.put(url, values, {
                onSuccess: () => {
                  toast.success("Script updated successfully!");
                  onOpenChange(false);
                },
                onError: (errors) => {
                  console.error(errors);
                  toast.error("Failed to update script.");
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
              {/* Paper */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paper_id" className="text-right">
                  Paper
                </Label>
                <Select
                  value={values.paper_id || ""}
                  onValueChange={(value) => setFieldValue("paper_id", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select paper (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paper_id">None</SelectItem>
                    {papers.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="center_origin" className="text-right">
                  Center Origin
                </Label>
                <Field
                  as={Input}
                  id="center_origin"
                  name="center_origin"
                  placeholder="e.g., Center Name"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="center_origin"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current_location" className="text-right">
                  Current Location
                </Label>
                <Field
                  as={Input}
                  id="current_location"
                  name="current_location"
                  placeholder="e.g., Marking Center A"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="current_location"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={values.status || ""}
                  onValueChange={(value) => setFieldValue("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">None</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="allocated">In Transit</SelectItem>
                    <SelectItem value="marked">Marked</SelectItem>
                    <SelectItem value="checked">Checked</SelectItem>
                  </SelectContent>
                </Select>
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