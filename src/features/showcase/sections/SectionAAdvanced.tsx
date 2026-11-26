import { useState } from 'react';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { MarkdownEditor } from '@/components/ui/MarkdownEditor';
import { DynamicFieldArray, type DynamicFieldItem } from '@/components/ui/DynamicFieldArray';
import { MultiStepWizard } from '@/components/ui/MultiStepWizard';
import { CascadingSelect } from '@/components/ui/CascadingSelect';
import { JsonSchemaForm } from '@/components/ui/JsonSchemaForm';
import type { FormDemoProps } from './SectionABasic';

export function SectionAAdvanced({ state }: FormDemoProps) {
  const [fields, setFields] = useState<DynamicFieldItem[]>([
    { id: '1', key: 'env', value: 'production' },
    { id: '2', key: 'cluster', value: 'us-west-2' },
  ]);
  const [mdVal, setMdVal] = useState(
    '# Markdown Live Editor\n\n- React 19 support\n- Tailwind CSS v4 variables\n> Live dual-mode preview.',
  );

  const disabled = state === 'disabled';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tiptap Rich Text */}
        <RichTextEditor
          label="Tiptap Rich Text Editor"
          helperText="Bold, italic, headings, lists, blockquote, code and history"
          disabled={disabled}
        />

        {/* Markdown Editor */}
        <MarkdownEditor
          label="Markdown Editor with Preview"
          value={mdVal}
          onChange={setMdVal}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Dynamic Field Array */}
        <div className="rounded-xl border border-border bg-surface p-4 shadow-soft">
          <DynamicFieldArray
            label="Dynamic Field Array (Repeatable Key/Value Rows)"
            items={fields}
            onChange={setFields}
            disabled={disabled}
          />
        </div>

        {/* Cascading Dropdowns */}
        <div className="rounded-xl border border-border bg-surface p-4 shadow-soft">
          <CascadingSelect
            label="Cascading Dropdowns (Country → State → City)"
            helperText="Dependent cascading selections update synchronously"
          />
        </div>
      </div>

      {/* Multi-step Wizard */}
      <MultiStepWizard
        steps={[
          { id: 'step-1', title: 'Profile Info' },
          { id: 'step-2', title: 'Subscription Plan' },
          { id: 'step-3', title: 'Confirmation' },
        ]}
      />

      {/* JSON Schema Form */}
      <JsonSchemaForm />
    </div>
  );
}
