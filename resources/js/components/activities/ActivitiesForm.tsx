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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import activities from "@/routes/activities";

interface Activity {
  id?: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: string;
  type: string;
  venue?: string;
  address?: string;
  budget?: number;
  actual_cost?: number;
  lead_id?: string;
}

interface ActivitiesFormProps {
  initialData?: Activity | null;
  employees: { id: string; first_name: string; last_name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivitiesForm({
  initialData,
  employees,
  open,
  onOpenChange,
}: ActivitiesFormProps) {
  const isEditMode = !!initialData?.id;

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required").min(3),
    description: Yup.string().nullable(),
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date().nullable().min(Yup.ref("start_date"), "End date must be after start date"),
    status: Yup.string().required("Status is required"),
    type: Yup.string().required("Type is required"),
    venue: Yup.string().nullable(),
    address: Yup.string().nullable(),
    budget: Yup.number().nullable().min(0),
    actual_cost: Yup.number().nullable().min(0),
    lead_id: Yup.string().required("Lead is required"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Activity" : "Create New Activity"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the activity details." : "Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            title: initialData?.title || "",
            description: initialData?.description || "",
            start_date: initialData?.start_date || "",
            end_date: initialData?.end_date || "",
            status: initialData?.status || "draft",
            type: initialData?.type || "assessment",
            venue: initialData?.venue || "",
            address: initialData?.address || "",
            budget: initialData?.budget || "",
            actual_cost: initialData?.actual_cost || "",
            lead_id: initialData?.lead_id || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const isEdit = !!initialData?.id;

            if (isEdit) {
              router.put(
                activities.update(initialData!.id!).url || `/activities/${initialData!.id}`,
                values,
                {
                  onSuccess: () => {
                    toast.success("Activity updated successfully!");
                    onOpenChange(false);
                  },
                  onError: () => toast.error("Failed to update activity"),
                  onFinish: () => setSubmitting(false),
                }
              );
            } else {
              router.post(
                activities.store().url || "/activities",
                values,
                {
                  onSuccess: () => {
                    toast.success("Activity created successfully!");
                    onOpenChange(false);
                  },
                  onError: () => toast.error("Failed to create activity"),
                  onFinish: () => setSubmitting(false),
                }
              );
            }
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Field as={Input} name="title" id="title" placeholder="Annual Assessment 2026" />
                <ErrorMessage name="title" component="p" className="text-red-600 text-sm mt-1" />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Field as={Textarea} name="description" id="description" placeholder="Describe this activity..." />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Field type="datetime-local" name="start_date" id="start_date" className="w-full" />
                  <ErrorMessage name="start_date" component="p" className="text-red-600 text-sm mt-1" />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Field type="datetime-local" name="end_date" id="end_date" className="w-full" />
                  <ErrorMessage name="end_date" component="p" className="text-red-600 text-sm mt-1" />
                </div>
              </div>

              {/* Type & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={values.type} onValueChange={(v) => setFieldValue("type", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="award_ceremony">Award Ceremony</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select value={values.status} onValueChange={(v) => setFieldValue("status", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Field as={Input} type="text" name="address" id="address" className="w-full" />
                  <ErrorMessage name="address" component="p" className="text-red-600 text-sm mt-1" />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Field as={Input} type="text" name="venue" id="venue" className="w-full" />
                  <ErrorMessage name="venue" component="p" className="text-red-600 text-sm mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="lead_id">Lead Person *</Label>
                <Select value={values.lead_id} onValueChange={(v) => setFieldValue("lead_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage name="lead_id" component="p" className="text-red-600 text-sm mt-1" />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isEditMode ? "Update Activity" : "Create Activity"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}