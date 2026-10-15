import {
  Input as AriaInput,
  TextField as AriaTextField,
  TextArea as AriaTextArea,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components/TextField";
import { Label, FieldError, Description } from "./Form";
import "./TextField.css";
import type React from "react";

export interface TextFieldProps<
  T = HTMLInputElement,
> extends AriaTextFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  inputRef?: React.Ref<T>;
}

export function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  inputRef,
  required,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField {...props} isRequired={required}>
      {label && <Label>{label}</Label>}
      <AriaInput
        ref={inputRef}
        className="react-aria-Input inset"
        placeholder={placeholder}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}

export function Textarea({
  label,
  description,
  errorMessage,
  placeholder,
  inputRef,
  required,
  ...props
}: TextFieldProps<HTMLTextAreaElement>) {
  return (
    <AriaTextField {...props} isRequired={required}>
      <Label>{label}</Label>
      <AriaTextArea
        ref={inputRef}
        className="react-aria-TextArea inset"
        placeholder={placeholder}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
