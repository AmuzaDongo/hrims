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
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import users from "@/routes/users";
import type { User } from "@/types/user";
import { MultiSelect } from "../ui/MultiSelect";

interface UserFormProps {
  initialData?: User & { roles?: Array<{ id: number }> };
  roles: Array<{ id: number; role?: { name?: string } }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserForm({
  initialData,
  roles,
  open,
  onOpenChange,
}: UserFormProps) {
  const isEditMode = !!initialData?.id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: isEditMode
      ? Yup.string().nullable()
      : Yup.string().min(6).required("Password is required"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-131.25 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit User" : "Add User"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the user details below."
              : "Create a new user."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            name: initialData?.name || "",
            email: initialData?.email || "",
            password: "",
            avatar: null as File | null,
            cover: null as File | null,
            role_ids: initialData?.roles?.map((r) => String(r.id)) || [],
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const url = isEditMode
              ? users.update(initialData!.id!)
              : users.store();

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            values.role_ids.forEach((roleId: string) => {
              formData.append("role_ids[]", roleId);
            });


            if (values.password) {
              formData.append("password", values.password);
            }

            if (values.avatar) {
              formData.append("avatar", values.avatar);
            }

            if (values.cover) {
              formData.append("cover", values.cover);
            }

            values.role_ids.forEach((roleId: string) => {
              formData.append("role_ids[]", roleId);
            });

            if (isEditMode) {
              formData.append("_method", "PUT");
            }

            router.post(url, formData, {
              forceFormData: true,
              onSuccess: () => {
                toast.success(
                  isEditMode
                    ? "User updated successfully!"
                    : "User created successfully!"
                );
                resetForm();
                onOpenChange(false);
              },
              onError: () => {
                toast.error(
                  isEditMode
                    ? "Failed to update user."
                    : "Failed to create user."
                );
              },
              onFinish: () => setSubmitting(false),
            });
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="John Doe"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <Field
                  as={Input}
                  name="email"
                  placeholder="eg: user@example.com"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Password</Label>
                <Field
                  as={Input}
                  name="password"
                  type="password"
                  placeholder="eg: ********"
                  className="col-span-3"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right">Roles</Label>
                <div className="col-span-3">
                  <MultiSelect
                    options={roles.map((b: any) => ({
                      value: String(b.id),
                      label: `${b.role?.name ?? "No Role"}`,
                    }))}
                    value={values.role_ids || []}
                    onChange={(val) => setFieldValue("role_ids", val)}
                    placeholder="Select Roles"
                  />
                </div>
              </div>

              {/* Cover Upload */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Cover Image</Label>
                <div className="col-span-3">
                  <FileUpload
                    value={values.cover}
                    onChange={(file) => setFieldValue("cover", file)}
                  />
                </div>
                <ErrorMessage
                  name="cover"
                  component="p"
                  className="col-span-4 text-sm text-red-600"
                />
              </div>

              {/* Avatar Upload */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Avatar</Label>
                <div className="col-span-3">
                  <FileUpload
                    value={values.avatar}
                    onChange={(file) => setFieldValue("avatar", file)}
                  />
                </div>
                <ErrorMessage
                  name="avatar"
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
                  {isEditMode ? "Update User" : "Create User"}
                </Button>
              </DialogFooter>

            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}