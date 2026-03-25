export function fetchAPI(path: string) {
  return fetch(`/api/${path}`);
}
