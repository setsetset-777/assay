import ReactMarkdown from "react-markdown";

import "./TextBlock.scss";
import "@/styles/utilities/markdown.scss";

export interface Props {
  value: string;
}

export function TextBlock({ value }: Props) {
  return (
    <div className="text-block markdown">
      <ReactMarkdown>{value}</ReactMarkdown>
    </div>
  );
}
