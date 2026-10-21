import "./Progress.scss";
import type { ProgressSteps } from "@/types";
import clsx from "clsx";

interface Props {
  steps: ProgressSteps;
  active: number;
}

export function Progress({ steps, active }: Props) {
  return (
    <ul className="progress">
      {steps.map(({ title, href }, index) => (
        <li
          className={clsx("progress__step", {
            "progress__step--active": index < active,
          })}
        >
          <a className="progress__link" href={href} title={title} />
        </li>
      ))}
    </ul>
  );
}
