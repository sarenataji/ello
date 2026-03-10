import { Outlet } from "react-router";
import { VortexProvider } from "./vortex-context";
import { XpProvider } from "./xp-context";
import { ThemeProvider } from "./theme-context";

export function RootLayout() {
  return (
    <VortexProvider>
      <XpProvider>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </XpProvider>
    </VortexProvider>
  );
}