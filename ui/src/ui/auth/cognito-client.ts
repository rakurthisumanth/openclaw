import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const region = import.meta.env.VITE_AWS_REGION;

export const COGNITO_CONFIG = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  region,
};

export function assertCognitoConfig() {
  if (!COGNITO_CONFIG.userPoolId || !COGNITO_CONFIG.clientId || !COGNITO_CONFIG.region) {
    throw new Error(
      "Missing VITE_COGNITO_USER_POOL_ID, VITE_COGNITO_CLIENT_ID, or VITE_AWS_REGION.",
    );
  }
}

export const cognitoClient = new CognitoIdentityProviderClient({
  region,
});
