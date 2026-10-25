import {
  Input as AriaInput,
  TextField as AriaTextField,
  TextArea as AriaTextArea,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components/TextField";
import { Label, FieldError, Description } from "./Form";
import "./TextField.scss";
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
    <AriaTextField
      {...props}
      isRequired={required}
      className="field field--text"
    >
      {label && <Label>{label}</Label>}
      {description && <Description>{description}</Description>}
      <AriaInput
        ref={inputRef}
        className="input input--text"
        placeholder={placeholder}
      />
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
    <AriaTextField
      {...props}
      isRequired={required}
      className="field field--textarea"
    >
      <Label>{label}</Label>
      {description && <Description>{description}</Description>}
      <AriaTextArea
        ref={inputRef}
        className="input input--textarea"
        placeholder={placeholder}
      />
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
