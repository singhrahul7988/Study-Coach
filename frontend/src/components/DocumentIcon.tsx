import { FileCode2, FileText, FileType2 } from "lucide-react";
import type { DocumentFormat } from "@/types/document";

interface DocumentIconProps {
  format: DocumentFormat;
}

export function DocumentIcon({ format }: DocumentIconProps) {
  const Icon =
    format === "docx" ? FileType2 : format === "md" ? FileCode2 : FileText;

  return (
    <span
      className={`document-list-icon document-list-icon-${format}`}
      aria-hidden="true"
    >
      <Icon />
    </span>
  );
}
