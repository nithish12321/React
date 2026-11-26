import { useState } from 'react';
import { Mail, Lock, Hash, Search, ArrowRight } from 'lucide-react';
import { Button, ButtonGroup, SplitButton } from '@/components/ui/Button';
import { Input, type InputDisplayState, type InputSize } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Switch } from '@/components/ui/Switch';
import { Select } from '@/components/ui/Select';

export interface FormDemoProps {
  state: InputDisplayState;
  size: InputSize;
}

export function SectionABasic({ state, size }: FormDemoProps) {
  const [textVal, setTextVal] = useState('John Doe');
  const [emailVal, setEmailVal] = useState('john@example.com');
  const [passVal, setPassVal] = useState('Secret123!');
  const [numVal, setNumVal] = useState('42');
  const [textareaVal, setTextareaVal] = useState('This is a demo textarea with character counter.');
  const [check1, setCheck1] = useState(true);
  const [radioVal, setRadioVal] = useState('pro');
  const [switchVal, setSwitchVal] = useState(true);
  const [selectVal, setSelectVal] = useState('react');
  const [btnLoading, setBtnLoading] = useState(false);

  const errorText = state === 'error' ? 'This field has a validation error' : undefined;
  const successText = state === 'success' ? 'Validated successfully' : undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Text Input */}
        <Input
          label="Text Input"
          placeholder="Enter name…"
          value={state === 'filled' ? 'Filled Value' : textVal}
          onChange={(e) => setTextVal(e.target.value)}
          size={size}
          state={state}
          clearable
          onClear={() => setTextVal('')}
          prefixIcon={<Search className="h-3.5 w-3.5" />}
          helperText="Standard text input with prefix icon"
          errorText={errorText}
          successText={successText}
        />

        {/* Email Input */}
        <Input
          type="email"
          label="Email Input"
          placeholder="name@company.com"
          value={emailVal}
          onChange={(e) => setEmailVal(e.target.value)}
          size={size}
          state={state}
          prefixIcon={<Mail className="h-3.5 w-3.5" />}
          helperText="Requires standard email format"
          errorText={errorText}
          successText={successText}
        />

        {/* Password Input */}
        <Input
          type="password"
          label="Password Input"
          value={passVal}
          onChange={(e) => setPassVal(e.target.value)}
          size={size}
          state={state}
          prefixIcon={<Lock className="h-3.5 w-3.5" />}
          helperText="Protected masked password"
          errorText={errorText}
          successText={successText}
        />

        {/* Number Input */}
        <Input
          type="number"
          label="Number Input"
          value={numVal}
          onChange={(e) => setNumVal(e.target.value)}
          size={size}
          state={state}
          prefixIcon={<Hash className="h-3.5 w-3.5" />}
          helperText="Numeric stepper field"
          errorText={errorText}
          successText={successText}
        />

        {/* Select Dropdown */}
        <Select
          label="Select Dropdown"
          value={selectVal}
          onChange={setSelectVal}
          size={size}
          state={state}
          clearable
          options={[
            { value: 'react', label: 'React 19' },
            { value: 'ts', label: 'TypeScript Strict' },
            { value: 'tailwind', label: 'Tailwind CSS v4' },
            { value: 'redux', label: 'Redux Toolkit' },
          ]}
          errorText={errorText}
        />

        {/* Switch */}
        <div className="flex flex-col justify-center rounded-md border border-border bg-surface p-3">
          <Switch
            label="Enable Feature Toggle"
            description="Active state demo switch"
            checked={switchVal}
            onChange={setSwitchVal}
            size={size}
            disabled={state === 'disabled'}
          />
        </div>
      </div>

      {/* Textarea & Checkbox/Radio Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Textarea with Counter"
          value={textareaVal}
          onChange={(e) => setTextareaVal(e.target.value)}
          maxLength={150}
          showCount
          rows={3}
          size={size}
          state={state}
          helperText="Auto-counting textarea"
          errorText={errorText}
        />

        <div className="grid grid-cols-2 gap-4 rounded-md border border-border bg-surface p-4">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-foreground block">Checkboxes</span>
            <Checkbox
              label="Option A (Checked)"
              checked={check1}
              onChange={setCheck1}
              size={size}
              disabled={state === 'disabled'}
            />
            <Checkbox
              label="Option B (Indeterminate)"
              indeterminate
              size={size}
              disabled={state === 'disabled'}
            />
          </div>

          <div>
            <RadioGroup
              name="demo-plan"
              label="Radio Options"
              value={radioVal}
              onChange={setRadioVal}
              size={size}
              options={[
                { value: 'starter', label: 'Starter' },
                { value: 'pro', label: 'Professional' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Button Showcase */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">
            Buttons (Variants, Sizes & States)
          </span>
          <Button size="sm" variant="outline" onClick={() => setBtnLoading((prev) => !prev)}>
            Toggle Loading State
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button size={size} variant="default" loading={btnLoading || state === 'loading'}>
            Default Primary
          </Button>
          <Button size={size} variant="secondary" loading={btnLoading || state === 'loading'}>
            Secondary
          </Button>
          <Button size={size} variant="outline" loading={btnLoading || state === 'loading'}>
            Outline
          </Button>
          <Button size={size} variant="ghost" loading={btnLoading || state === 'loading'}>
            Ghost
          </Button>
          <Button size={size} variant="danger" loading={btnLoading || state === 'loading'}>
            Destructive
          </Button>
          <Button size={size} variant="link">
            Link Style
          </Button>
          <Button size={size} variant="default" disabled>
            Disabled
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
          <ButtonGroup>
            <Button size="sm" variant="outline">
              Left
            </Button>
            <Button size="sm" variant="outline">
              Middle
            </Button>
            <Button size="sm" variant="outline">
              Right
            </Button>
          </ButtonGroup>

          <SplitButton
            label="Save Project"
            size="sm"
            menuButton={
              <Button size="sm" variant="default" className="px-2" aria-label="More actions">
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
