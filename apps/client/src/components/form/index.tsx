import { type ComponentType } from "react";
import { type Field, type FieldType, type FieldOf } from "@/schemas/form";
import { TextField, Textarea } from "./TextField";
import { useController, type FieldValues } from "react-hook-form";

export { Form } from "./Form";

const RhfTextField = (props: FieldOf<"text">) => {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController<FieldValues>({ name: props.name });
  return (
    <TextField
      {...props}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
      isInvalid={invalid}
      errorMessage={error?.message}
    />
  );
};

const RhfTextarea = (props: FieldOf<"textarea">) => {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController<FieldValues>({ name: props.name });
  return (
    <Textarea
      {...props}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
      isInvalid={invalid}
      errorMessage={error?.message}
    />
  );
};

const fieldComponents: Partial<{
  [T in FieldType]: ComponentType<FieldOf<T>>;
}> = {
  text: RhfTextField,
  textarea: RhfTextarea,
};

export function FieldRenderer(props: Field) {
  const Comp = fieldComponents[props.type] as ComponentType<Field>;
  return <Comp {...props} />;
}
