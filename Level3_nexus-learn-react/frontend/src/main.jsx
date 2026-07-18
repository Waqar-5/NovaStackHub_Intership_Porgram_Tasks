import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { AuthProvider } from "@/components/auth-provider";
import { NotificationProvider } from "@/components/notification-provider";
import App from "./App.jsx";
import "./index.css";

// NotificationProvider uses useNavigate, so it must render inside
// BrowserRouter — that's why the provider order here differs slightly
// from a typical top-down wrap: Router comes before everything else.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </AuthProvider>
          <Toaster position="top-right" richColors closeButton />
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
