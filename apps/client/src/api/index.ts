export function fetchAPI(path: string) {
  return fetch(`/api/${path}`);
}

export function fetchForm(formId: string) {
  return fetchAPI(`form/${formId}`);
}
