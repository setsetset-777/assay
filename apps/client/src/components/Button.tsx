import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from "react-aria-components/Button";

interface ButtonProps extends RACButtonProps {}

export function Button(props: ButtonProps) {
  return <RACButton {...props}>{props.children}</RACButton>;
}
