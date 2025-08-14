export interface GoogleAccount {
    provider: string;
    type: string;
    providerAccountId: string;
    access_token: string;
    refresh_token?: string;
    expires_at: number;
    scope: string;
    token_type: string;
    id_token: string;
  }
  
  export interface GoogleProfile {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
  }
  
  export interface AuthPayload {
    email: string;
    providerId: string;
    providerAccessToken: string;
    providerRefreshToken?: string;
  }