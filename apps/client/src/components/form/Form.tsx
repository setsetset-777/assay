import { Form as RACForm, type FormProps } from "react-aria-components/Form";
import {
  type LabelProps,
  Label as RACLabel,
} from "react-aria-components/Label";
import {
  type FieldErrorProps,
  FieldError as RACFieldError,
} from "react-aria-components/FieldError";
import { Text, type TextProps } from "react-aria-components/Text";
import "./Form.scss";
import clsx from "clsx";

export function Form({ className, ...props }: FormProps) {
  return (
    <RACForm
      validationBehavior="aria"
      {...props}
      className={clsx("form", className)}
    />
  );
}

export function Label(props: LabelProps) {
  return <RACLabel {...props} className="label" />;
}

export function FieldError(props: FieldErrorProps) {
  return <RACFieldError {...props} className="field-error" />;
}

export function Description(props: TextProps) {
  return <Text slot="description" className="description" {...props} />;
}
