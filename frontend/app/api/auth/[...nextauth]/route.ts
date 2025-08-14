import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { AuthPayload, GoogleAccount, GoogleProfile } from "@/app/types/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
        }
      }
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const googleAccount = account as GoogleAccount;
        const googleProfile = profile as GoogleProfile;

        const payload: AuthPayload = {
          email: googleProfile.email,
          providerId: googleProfile.sub,
          providerAccessToken: googleAccount.access_token,
          providerRefreshToken: googleAccount.refresh_token,
        };
        token.oauthPayload = payload;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.oauthPayload) {
        (session as any).oauthPayload = token.oauthPayload;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };