import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { PublicRoute } from "../components/auth/PublicRoute";
import { authApi } from "../api/auth.api";

vi.mock("../api/auth.api", () => ({
   authApi: {
      getMe: vi.fn(),
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
   },
}));

describe("PublicRoute component", () => {
   beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
   });

   it("renders public children when user is not authenticated", async () => {
      render(
         <AuthProvider>
            <MemoryRouter initialEntries={["/login"]}>
               <Routes>
                  <Route
                     path="/login"
                     element={
                        <PublicRoute>
                           <div>Public Login Page Content</div>
                        </PublicRoute>
                     }
                  />
                  <Route path="/home" element={<div>Home Dashboard</div>} />
               </Routes>
            </MemoryRouter>
         </AuthProvider>,
      );

      await waitFor(() => {
         expect(
            screen.getByText("Public Login Page Content"),
         ).toBeInTheDocument();
      });
      expect(screen.queryByText("Home Dashboard")).not.toBeInTheDocument();
   });

   it("redirects authenticated user away from public route to /home", async () => {
      localStorage.setItem("token", "fake-jwt-token");
      vi.mocked(authApi.getMe).mockResolvedValueOnce({
         id: "u123",
         email: "tanay@habitpulse.com",
         firstName: "Tanay",
         lastName: "Pratap",
      });

      render(
         <AuthProvider>
            <MemoryRouter initialEntries={["/login"]}>
               <Routes>
                  <Route
                     path="/login"
                     element={
                        <PublicRoute>
                           <div>Public Login Page Content</div>
                        </PublicRoute>
                     }
                  />
                  <Route path="/home" element={<div>Home Dashboard</div>} />
               </Routes>
            </MemoryRouter>
         </AuthProvider>,
      );

      await waitFor(() => {
         expect(screen.getByText("Home Dashboard")).toBeInTheDocument();
      });
      expect(
         screen.queryByText("Public Login Page Content"),
      ).not.toBeInTheDocument();
   });
});
