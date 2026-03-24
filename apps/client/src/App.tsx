import { useQuery } from "@tanstack/react-query";

import PageLoader from "./components/PageLoader";

import "./App.css";

function App() {
  const { isPending } = useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const response = await fetch("/api/routes");
      if (!response.ok) {
        throw new Error("Error fetchinf routes");
      }
      return response.json();
    },
  });

  if (isPending) {
    return <PageLoader />;
  }

  return (
    <>
      <h1>Assay</h1>
    </>
  );
}

export default App;
