"use client";

import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Label } from "@/components/ui/input";

export function RichEditor({
  name,
  label,
  defaultValue,
  height = 320,
}: {
  name: string;
  label: string;
  defaultValue: string;
  height?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <Label>{label}</Label>
      <input type="hidden" name={name} value={value} />
      <div className="overflow-hidden rounded-xl border border-black/15 bg-[#f8f4ee] p-1 [&_.tox-tinymce]:!border-0 [&_.tox-editor-header]:!bg-[#f8f4ee] [&_.tox-statusbar]:!bg-[#f8f4ee]">
        <Editor
          tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@7.6.1/tinymce.min.js"
          licenseKey="gpl"
          value={value}
          onEditorChange={setValue}
          init={{
            height,
            menubar: false,
            toolbar_mode: "wrap",
            branding: false,
            promotion: false,
            statusbar: true,
            plugins: "lists link image code table autoresize wordcount",
            toolbar:
              "code undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist | link image table | removeformat",
            font_family_formats:
              "Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times; Georgia=georgia,serif; Verdana=verdana,geneva,sans-serif",
            content_style: "body { font-family: Arial, Helvetica, sans-serif; font-size: 16px; }",
            images_upload_handler: async (blobInfo: { blob: () => Blob; filename: () => string }) => {
              const body = new FormData();
              body.set("file", new File([blobInfo.blob()], blobInfo.filename()));
              const res = await fetch("/api/upload", { method: "POST", body });
              const data = (await res.json()) as { url?: string; error?: string };
              if (!res.ok || !data.url) throw new Error(data.error || "Tải ảnh thất bại");
              return data.url;
            },
          }}
        />
      </div>
    </div>
  );
}
