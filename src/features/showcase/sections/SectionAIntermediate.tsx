import { useState } from 'react';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { Combobox } from '@/components/ui/Combobox';
import { AsyncAutocomplete } from '@/components/ui/AsyncAutocomplete';
import { TagsInput } from '@/components/ui/TagsInput';
import { Slider } from '@/components/ui/Slider';
import { DatePicker } from '@/components/ui/DatePicker';
import { TimePicker } from '@/components/ui/TimePicker';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { FileUpload } from '@/components/ui/FileUpload';
import { OtpInput } from '@/components/ui/OtpInput';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { MaskedInput } from '@/components/ui/MaskedInput';
import { Rating } from '@/components/ui/Rating';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { NumberStepper } from '@/components/ui/NumberStepper';
import type { FormDemoProps } from './SectionABasic';

export function SectionAIntermediate({ state, size }: FormDemoProps) {
  const [multiVal, setMultiVal] = useState(['react', 'ts']);
  const [comboboxVal, setComboboxVal] = useState('apple');
  const [tagsVal, setTagsVal] = useState(['UI', 'Tailwind', 'Redux']);
  const [sliderVal, setSliderVal] = useState([65]);
  const [rangeVal, setRangeVal] = useState([25, 75]);
  const [dateVal, setDateVal] = useState('2026-11-24');
  const [timeVal, setTimeVal] = useState('14:30');
  const [colorVal, setColorVal] = useState('#3b82f6');
  const [otpVal, setOtpVal] = useState('492018');
  const [phoneVal, setPhoneVal] = useState('9876543210');
  const [currencyVal, setCurrencyVal] = useState(2450.5);
  const [cardVal, setCardVal] = useState('4532 8920 1834 9921');
  const [ratingVal, setRatingVal] = useState(4.5);
  const [segVal, setSegVal] = useState('daily');
  const [stepperVal, setStepperVal] = useState(4);

  const disabled = state === 'disabled';

  const mockAsyncSearch = async (q: string) => {
    await new Promise((r) => setTimeout(r, 200));
    const items = [
      { id: '1', title: `Result matching "${q}"`, subtitle: 'Primary database match' },
      { id: '2', title: `Secondary tag for "${q}"`, subtitle: 'Global tag index' },
    ];
    return items;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MultiSelect
        label="Multi-Select"
        value={multiVal}
        onChange={setMultiVal}
        size={size}
        disabled={disabled}
        options={[
          { value: 'react', label: 'React' },
          { value: 'ts', label: 'TypeScript' },
          { value: 'vite', label: 'Vite' },
          { value: 'tailwind', label: 'Tailwind' },
        ]}
      />

      <Combobox
        label="Combobox"
        value={comboboxVal}
        onChange={setComboboxVal}
        size={size}
        disabled={disabled}
        options={[
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
          { value: 'cherry', label: 'Cherry' },
        ]}
      />

      <AsyncAutocomplete
        label="Async Autocomplete"
        fetcher={mockAsyncSearch}
        onSelect={(item) => void item}
        disabled={disabled}
      />

      <TagsInput label="Tags Input" value={tagsVal} onChange={setTagsVal} disabled={disabled} />

      <DatePicker label="Date Picker" value={dateVal} onChange={setDateVal} disabled={disabled} />

      <TimePicker label="Time Picker" value={timeVal} onChange={setTimeVal} disabled={disabled} />

      <ColorPicker
        label="Color Picker"
        value={colorVal}
        onChange={setColorVal}
        disabled={disabled}
      />

      <PhoneInput
        label="Phone with Country Code"
        value={phoneVal}
        onChange={setPhoneVal}
        disabled={disabled}
      />

      <CurrencyInput
        label="Currency Input"
        value={currencyVal}
        onChange={setCurrencyVal}
        disabled={disabled}
      />

      <MaskedInput
        label="Masked Input (Credit Card)"
        value={cardVal}
        onChange={setCardVal}
        disabled={disabled}
      />

      <div className="flex flex-col justify-between rounded-md border border-border bg-surface p-3">
        <Rating label="Star Rating" value={ratingVal} onChange={setRatingVal} disabled={disabled} />
      </div>

      <div className="flex flex-col justify-between rounded-md border border-border bg-surface p-3">
        <NumberStepper
          label="Number Stepper"
          value={stepperVal}
          onChange={setStepperVal}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col justify-between rounded-md border border-border bg-surface p-3">
        <SegmentedControl
          label="Segmented Control"
          value={segVal}
          onChange={setSegVal}
          disabled={disabled}
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
        />
      </div>

      <div className="flex flex-col justify-between rounded-md border border-border bg-surface p-3">
        <Slider
          label="Single Slider"
          value={sliderVal}
          onChange={setSliderVal}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col justify-between rounded-md border border-border bg-surface p-3">
        <Slider
          label="Dual-Handle Range Slider"
          value={rangeVal}
          onChange={setRangeVal}
          disabled={disabled}
        />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <OtpInput
          label="6-Digit OTP Verification Input"
          value={otpVal}
          onChange={setOtpVal}
          disabled={disabled}
        />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <FileUpload label="File Upload (Drag-and-Drop & Multi-File Previews)" disabled={disabled} />
      </div>
    </div>
  );
}
