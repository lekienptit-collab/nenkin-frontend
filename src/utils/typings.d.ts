declare namespace TOKEN {
  type Auth = {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    expiresAt?: number;
  };
}
