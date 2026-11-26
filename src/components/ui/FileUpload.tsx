import { useState, useRef, type DragEvent } from 'react';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
}

export interface FileUploadProps {
  label?: string;
  helperText?: string;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  label,
  helperText,
  multiple = true,
  maxFiles = 5,
  disabled = false,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList)
      .slice(0, maxFiles - files.length)
      .map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        size: f.size,
        progress: 100, // Simulated immediate progress
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) addFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn('w-full flex flex-col gap-2', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors cursor-pointer',
          isDragging && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface/50',
          !disabled && 'hover:bg-muted-surface/40 hover:border-primary/50',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted-surface text-primary mb-2">
          <UploadCloud className="h-5 w-5" />
        </div>
        <p className="text-xs font-medium text-foreground">
          <span className="text-primary hover:underline">Click to upload</span> or drag and drop
        </p>
        <p className="text-[11px] text-muted mt-0.5">
          PNG, JPG, PDF or XLSX up to 10MB (max {maxFiles} files)
        </p>
      </div>

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="space-y-1.5 mt-1">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-md border border-border bg-surface p-2 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <File className="h-4 w-4 text-muted shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-[10px] text-muted">{formatSize(file.size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="rounded p-1 text-muted hover:text-danger hover:bg-muted-surface"
                  aria-label={`Remove file ${file.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
