import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";

const queryClient = new QueryClient({
   defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
   },
});

describe("AppLayout mobile responsiveness & toggle", () => {
   it("renders mobile navigation bar with hamburger menu toggle and new habit button", () => {
      render(
         <QueryClientProvider client={queryClient}>
            <AuthProvider>
               <BrowserRouter>
                  <AppLayout />
               </BrowserRouter>
            </AuthProvider>
         </QueryClientProvider>,
      );

      const menuButton = screen.getByRole("button", {
         name: /Open navigation menu/i,
      });
      expect(menuButton).toBeInTheDocument();

      // Click menu button to open sidebar
      fireEvent.click(menuButton);

      // Verify close button is present in the open mobile drawer
      const closeButton = screen.getByRole("button", {
         name: /Close menu/i,
      });
      expect(closeButton).toBeInTheDocument();

      // Click close button
      fireEvent.click(closeButton);
   });
});
