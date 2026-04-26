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
import roles_permissions from "@/routes/roles-permissions";


interface Role {  
  id: number;
  name: string;
  permissions: { id: number; name: string }[];
}

interface RoleFormProps {
  initialData?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleForm({
  initialData,
  open,
  onOpenChange,
}: RoleFormProps) {
  const isEditMode = !!initialData?.id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-131.25 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Role" : "Add Role"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the role details below."
              : "Create a new Role."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            name: initialData?.name || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const url = isEditMode
              ? roles_permissions.update(initialData!.id!)
              : roles_permissions.store();

            const formData = new FormData();
            formData.append("name", values.name);

            if (isEditMode) {
              formData.append("_method", "PUT");
            }

            router.post(url, formData, {
              forceFormData: true,
              onSuccess: () => {
                toast.success(
                  isEditMode
                    ? "Role updated successfully!"
                    : "Role created successfully!"
                );
                router.reload();
                resetForm();
                onOpenChange(false);
              },
              onError: () => {
                toast.error(
                  isEditMode
                    ? "Failed to update role."
                    : "Failed to create role."
                );
              },
              onFinish: () => setSubmitting(false),
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="eg. hr.manager"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="name"
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
                  {isEditMode ? "Update Role" : "Create Role"}
                </Button>
              </DialogFooter>

            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}