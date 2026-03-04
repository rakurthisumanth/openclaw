import {
  getValidAccessToken,
  login,
  logout,
  mapAuthError,
  refreshTokens,
  requestForgotPasswordOtp,
  resendSignUpOtp,
  resetPasswordWithOtp,
  signUp,
  verifySignUpOtp,
} from "./auth-service.ts";
import { getStoredTokens, hasValidStoredAccessToken } from "./token-store.ts";

export function useAuth() {
  return {
    isAuthenticated: hasValidStoredAccessToken(),
    tokens: getStoredTokens(),
    login,
    logout,
    signUp,
    verifySignUpOtp,
    resendSignUpOtp,
    requestForgotPasswordOtp,
    resetPasswordWithOtp,
    refreshTokens,
    getValidAccessToken,
    mapAuthError,
  };
}
