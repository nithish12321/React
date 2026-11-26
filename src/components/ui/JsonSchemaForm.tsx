import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface JsonSchemaField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
  required?: boolean;
}

export interface JsonSchemaFormProps {
  schema?: JsonSchemaField[];
  onSubmit?: (data: Record<string, string | number | boolean>) => void;
  className?: string;
}

const DEFAULT_SCHEMA: JsonSchemaField[] = [
  { name: 'projectName', label: 'Project Name', type: 'text', required: true },
  { name: 'budget', label: 'Budget ($)', type: 'number', required: true },
  {
    name: 'priority',
    label: 'Priority Level',
    type: 'select',
    options: ['Low', 'Medium', 'High', 'Critical'],
  },
  { name: 'notifyTeam', label: 'Notify Team Members', type: 'boolean' },
];

export function JsonSchemaForm({
  schema = DEFAULT_SCHEMA,
  onSubmit,
  className,
}: JsonSchemaFormProps) {
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({
    projectName: 'Acme Dashboard',
    budget: 5000,
    priority: 'High',
    notifyTeam: true,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3',
        className,
      )}
    >
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h4 className="text-xs font-semibold text-foreground">JSON-Schema Form Generator</h4>
        <span className="text-[10px] font-mono text-muted">{schema.length} fields configured</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {schema.map((field) => {
          if (field.type === 'boolean') {
            return (
              <label
                key={field.name}
                className="flex items-center gap-2 text-xs text-foreground cursor-pointer pt-2"
              >
                <input
                  type="checkbox"
                  checked={Boolean(formData[field.name])}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary accent-[var(--color-primary)]"
                />
                <span className="font-medium">{field.label}</span>
              </label>
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.name} className="space-y-1">
                <label className="text-xs font-medium text-foreground">{field.label}</label>
                <select
                  value={String(formData[field.name] ?? '')}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full h-8 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={field.name} className="space-y-1">
              <label className="text-xs font-medium text-foreground">{field.label}</label>
              <input
                type={field.type === 'number' ? 'number' : 'text'}
                value={String(formData[field.name] ?? '')}
                required={field.required}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                  })
                }
                className="w-full h-8 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Button type="submit" size="sm" variant="default">
          Submit Generated Form
        </Button>
        {submitted && (
          <span className="text-[11px] text-success font-medium">Data captured successfully!</span>
        )}
      </div>
    </form>
  );
}
