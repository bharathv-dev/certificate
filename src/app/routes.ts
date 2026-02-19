import { createBrowserRouter } from "react-router";
import { HomePage } from "./components/HomePage";
import { SignatureManagement } from "./components/SignatureManagement";
import { UnlockPage } from "./components/UnlockPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/signatures",
    Component: SignatureManagement,
  },
  {
    path: "/unlock",
    Component: UnlockPage,
  },
]);
