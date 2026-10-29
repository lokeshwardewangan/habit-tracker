import { apiClient } from "./client";
import type { User, ApiResponse } from "../types/api";

export interface SignupPayload {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
}

export interface LoginPayload {
   email: string;
   password: string;
}

export interface AuthResponseData {
   user: User;
   token: string;
}

export const authApi = {
   signup: async (payload: SignupPayload): Promise<AuthResponseData> => {
      const response = await apiClient.post<ApiResponse<AuthResponseData>>(
         "/auth/signup",
         payload,
      );
      return response.data.data!;
   },

   login: async (payload: LoginPayload): Promise<AuthResponseData> => {
      const response = await apiClient.post<ApiResponse<AuthResponseData>>(
         "/auth/login",
         payload,
      );
      return response.data.data!;
   },

   logout: async (): Promise<void> => {
      await apiClient.post("/auth/logout");
   },

   getMe: async (): Promise<User> => {
      const response =
         await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");
      return response.data.data!.user;
   },
};
