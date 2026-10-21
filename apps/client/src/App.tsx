import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

import "./App.scss";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
