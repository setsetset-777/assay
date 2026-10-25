import type { PropsWithChildren } from "react";
import "./FormLayout.scss";
import { Progress } from "@/components/Progress";
import { useFormStep } from "@/hooks/useFormStep";

interface Props extends PropsWithChildren {
  title: string;
  editor?: string;
  time?: string;
}

export function FormLayout({ children, title, editor, time }: Props) {
  const { steps, stepIndex } = useFormStep();

  const progressSteps = steps.map(({ title, href }) => ({ title, href }));

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
        <Progress steps={progressSteps} active={stepIndex} />
        {time && <p className="form-layout__time">{time}</p>}
      </header>
      <main className="form-layout__main">{children}</main>
      <footer className="form-layout__footer">
        Powered by <strong>Assay</strong>
      </footer>
    </div>
  );
}
