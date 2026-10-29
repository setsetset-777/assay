import type { FormValues } from "@/schemas/form";

export function fetchAPI(path: string) {
  return fetch(`/api/${path}`);
}

export function fetchForm(formId: string) {
  return fetchAPI(`form/${formId}`);
}

interface SuccessBody {
  formId: string;
  data: FormValues;
}

export function postSuccess({ data, formId }: SuccessBody) {
  return fetch("/api/form/success", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      formId,
      data,
    }),
  });
}
