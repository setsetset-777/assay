import "./Progress.scss";
import type { ProgressStep } from "@/types";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

interface Props {
  steps: Pick<ProgressStep, "title" | "href">[];
  active: number;
}

export function Progress({ steps, active }: Props) {
  return (
    <ul className="progress">
      {steps.map(({ title, href }, index) => (
        <li
          className={clsx("progress__step", {
            "progress__step--active": index < active + 1,
          })}
          key={index}
        >
          <Link className="progress__link" to={href} title={title} />
        </li>
      ))}
    </ul>
  );
}
