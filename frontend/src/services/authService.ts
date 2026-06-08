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

export const forgotPassword = async (email: string) => {
  const response = await api.post("/api/auth/forgot-password", { email });
  return response.data;
};

export const validateResetToken = async (token: string) => {
  const response = await api.get("/api/auth/reset-password/validate", {
    params: { token },
  });
  return response.data;
};

export const resetPassword = async (payload: { token: string; newPassword: String }) => {
  const response = await api.post("/api/auth/reset-password", payload);
  return response.data;
};