import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/form/$formId/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/form/$formId/step/$stepId",
      params: {
        formId: params.formId,
        stepId: "1"
      }
    })
  }
})
