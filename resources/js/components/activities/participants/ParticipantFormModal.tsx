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
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/MultiSelect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import activities from "@/routes/activities";

interface Participant {
  id?: string;
  employee_id?: string;
  employee_ids: string[];
  role: string;
  status: string;
  notes?: string;
}

interface ParticipantFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityId: string; 
  activityTitle: string;
  initialData?: Participant | null;
  employees: { 
    id: string; 
    first_name: string; 
    last_name: string 
  }[];
}

export default function ParticipantFormModal({
  open,
  onOpenChange,
  activityId,
  initialData,
  employees,
}: ParticipantFormModalProps) {
  const isEditMode = !!initialData?.id;
  const employeeOptions = (employees ?? []).map((emp) => ({
    label: `${emp.first_name} ${emp.last_name}`,
    value: emp.id,
  }));
  const validationSchema = Yup.object().shape({
    employee_ids: Yup.array()
      .min(1, "At least one participant is required")
      .required("Participants are required"),
    role: Yup.string().required("Role is required"),
    status: Yup.string().required("Status is required"),
    notes: Yup.string().nullable(),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Participant" : "Add New Participant"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update participant details for this activity." 
              : "Add a new participant to this activity."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            employee_ids: initialData?.employee_id
              ? [initialData.employee_id]
              : [],
            role: initialData?.role || "participant",
            status: initialData?.status || "invited",
            notes: initialData?.notes || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const isEdit = !!initialData?.id;

            if (isEdit) {
              const participantId = initialData?.id ?? "";
              router.put(
                activities.participants.update(
                  { activity: activityId, employee: participantId }
                ),
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
                activities.participants.store(activityId).url || `/activities/${activityId}/participants`,
                values,
                {
                  onSuccess: () => {
                    toast.success("Participant created successfully!");
                    onOpenChange(false);
                  },
                  onError: () => toast.error("Failed to create participant"),
                  onFinish: () => setSubmitting(false),
                }
              );
            }
          }}
          
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              {/* Select Employee */}
              <div>
                <MultiSelect
                  options={employeeOptions}
                  value={values.employee_ids || []}
                  onChange={(val) => setFieldValue("employee_ids", val)}
                  placeholder={
                    isEditMode
                      ? "Editing single participant"
                      : "Select participants"
                  }
                  disabled={false}
                />

                <ErrorMessage
                  name="employee_ids"
                  component="p"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={values.role}
                  onValueChange={(value) => setFieldValue("role", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="participant">Participant</SelectItem>
                    <SelectItem value="assessor">Assessor</SelectItem>
                    <SelectItem value="scout">Scout</SelectItem>
                    <SelectItem value="judge">Judge</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage name="role" component="p" className="text-red-600 text-sm mt-1" />
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={values.status}
                  onValueChange={(value) => setFieldValue("status", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="attended">Attended</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage name="status" component="p" className="text-red-600 text-sm mt-1" />
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Field
                  as={Textarea}
                  name="notes"
                  id="notes"
                  placeholder="Additional notes about this participant..."
                  className="mt-1"
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting 
                    ? "Saving..." 
                    : isEditMode 
                    ? "Update Participant" 
                    : "Add Participant"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}