"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({
  value,
  onChange,
  accept = "image/*",
}: FileUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onChange(file);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition",
          "hover:border-primary"
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="mx-auto max-h-40 object-cover rounded-md"
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Drag & drop or click to upload
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleSelect}
        className="hidden"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-sm text-red-600 hover:underline"
        >
          Remove file
        </button>
      )}
    </div>
  );
}