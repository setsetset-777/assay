import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from "react-aria-components/Button";
import clsx from "clsx";

import "./Button.scss";

interface ButtonProps extends RACButtonProps {
  variant?: "primary" | "secondary";
}

export function Button({ variant, type = "button", ...props }: ButtonProps) {
  return (
    <RACButton
      {...props}
      type={type}
      className={clsx("button", `button--${variant}`)}
    >
      {props.children}
    </RACButton>
  );
}
