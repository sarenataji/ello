import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/root-layout";
import { HomeScreen } from "./components/home-screen";
import { FocusScreen } from "./components/focus-screen";
import { GatekeeperScreen } from "./components/gatekeeper-screen";
import { ShieldScreen } from "./components/shield-screen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomeScreen },
      { path: "focus", Component: FocusScreen },
      { path: "gatekeeper", Component: GatekeeperScreen },
      { path: "shield", Component: ShieldScreen },
    ],
  },
]);