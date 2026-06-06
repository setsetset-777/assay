import { createFileRoute, notFound } from "@tanstack/react-router";
import { fetchForm } from "../api";

export const Route = createFileRoute("/form/$formId")({
  loader: async ({ params: { formId } }) => {
    const res = await fetchForm(formId);
    if (res.ok) {
      return await res.json();
    } else {
      throw notFound();
    }
  },
  component: FormComponent,
  notFoundComponent: () => {
    return <div>Form not found</div>;
  },
});

function FormComponent() {
  const form = Route.useLoaderData();
  return <div>{form.title}</div>;
}
