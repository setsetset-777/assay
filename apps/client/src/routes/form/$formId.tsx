import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { fetchForm } from "@/api";

export const Route = createFileRoute("/form/$formId")({
  loader: async ({ params: { formId } }) => {
    const res = await fetchForm(formId);
    if (res.ok) {
      return await res.json();
    } else {
      throw notFound();
    }
  },
  component: PageComponent,
  notFoundComponent: () => {
    return <div>Form not found</div>;
  },
});

function PageComponent() {
  const form = Route.useLoaderData();
  return (
    <div>
      <div>{form.title}</div>
      <Outlet />
    </div>
  );
}
