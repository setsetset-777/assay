import type { PropsWithChildren } from "react";
import "./FormLayout.scss";
import type { ProgressSteps } from "@/types";
import { Progress } from "@/components/Progress";

interface Props extends PropsWithChildren {
  title: string;
  editor?: string;
  time?: string;
  steps: ProgressSteps;
  activeStep: number;
}

export function FormLayout({
  children,
  title,
  editor,
  time,
  steps,
  activeStep,
}: Props) {
  return (
    <div className="form-layout">
      <header className="form-layout__header">
        <div className="form-layout__headline">
          <h2 className="form-layout__title">{title}</h2>
          {editor && (
            <p className="form-layout__editor">
              par <strong>{editor}</strong>
            </p>
          )}
        </div>
        <Progress steps={steps} active={activeStep} />
        {time && <p className="form-layout__time">{time}</p>}
      </header>
      <main className="form-layout__main">{children}</main>
      <footer className="form-layout__footer">
        Powered by <strong>Assay</strong>
      </footer>
    </div>
  );
}
