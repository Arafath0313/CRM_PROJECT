import api from "../api/axiosConfig";

export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

export const login = async (
  email: string,
  password: string
): Promise<LoginApiResponse> => {
  const response = await api.post<LoginApiResponse>("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const register = async (payload: {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
}) => {
  const response = await api.post("/api/auth/register", payload);
  return response.data;
};

export const verifyOtp = async (otp: string) => {
  const response = await api.post("/api/auth/verify-otp", { otp });
  return response.data;
};