import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { AuthProvider } from "../context/AuthContext";

describe("LoginPage component", () => {
   it("renders login form with email, password fields and 1-Click demo access", () => {
      render(
         <AuthProvider>
            <BrowserRouter>
               <LoginPage />
            </BrowserRouter>
         </AuthProvider>,
      );

      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
      expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(
         screen.getByRole("button", { name: /Sign in/i }),
      ).toBeInTheDocument();
      expect(
         screen.getByRole("button", {
            name: /1-Click Demo Login \(Tanay Pratap\)/i,
         }),
      ).toBeInTheDocument();
   });
});
