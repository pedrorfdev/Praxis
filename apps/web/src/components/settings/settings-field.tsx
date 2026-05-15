"use client";

import type { ComponentType } from "react";
import { PatternFormat } from "react-number-format";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field-error";

type Icon = ComponentType<{ className?: string }>;

type SettingsFieldProps = {
  label: string;
  icon?: Icon;
  error?: string;
  registration?: UseFormRegisterReturn;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  type?: string;
  value?: string;
  helper?: string;
  className?: string;
};

type MaskedSettingsFieldProps = Omit<SettingsFieldProps, "registration" | "type"> & {
  format: string;
  mask?: string;
  value: string;
  onValueChange: (value: string) => void;
};

export function SettingsField({
  label,
  icon: Icon,
  error,
  registration,
  disabled,
  readOnly,
  placeholder,
  type = "text",
  value,
  helper,
  className,
}: SettingsFieldProps) {
  const input = (
    <Input
      {...registration}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      className={className ?? (Icon ? "rounded-2xl h-14 pl-12" : "rounded-2xl h-14 px-6")}
    />
  );

  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
        {label}
      </label>
      {Icon ? (
        <div className="relative">
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {input}
        </div>
      ) : (
        input
      )}
      <FieldError message={error} />
      {helper ? <p className="text-xs text-muted-foreground italic ml-1">{helper}</p> : null}
    </div>
  );
}

export function MaskedSettingsField({
  label,
  icon: Icon,
  error,
  disabled,
  readOnly,
  placeholder,
  className,
  format,
  mask = "_",
  value,
  onValueChange,
}: MaskedSettingsFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        ) : null}
        <PatternFormat
          format={format}
          mask={mask}
          customInput={Input}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          onValueChange={(values) => onValueChange(values.formattedValue)}
          className={className ?? (Icon ? "rounded-2xl h-14 pl-12" : "rounded-2xl h-14 px-6")}
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}
