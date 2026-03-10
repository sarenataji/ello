import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen" style={{ backgroundColor: "#f7f6f3" }}>
      <RouterProvider router={router} />
    </div>
  );
}