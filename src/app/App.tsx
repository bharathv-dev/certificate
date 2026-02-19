import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SignatureProvider } from "./components/SignatureContext";

export default function App() {
  return (
    <SignatureProvider>
      <RouterProvider router={router} />
    </SignatureProvider>
  );
}
