import { type ComponentType } from "react";
import { type Field, type FieldType, type FieldOf } from "@/schemas/form";
import { TextField, TextArea } from "./TextField";

const fieldComponents: Partial<{
  [T in FieldType]: ComponentType<FieldOf<T>>;
}> = {
  text: TextField,
  textarea: TextArea,
};

export function FieldRenderer(props: Field) {
  const Comp = fieldComponents[props.type] as ComponentType<Field>;
  return <Comp {...props} />;
}
