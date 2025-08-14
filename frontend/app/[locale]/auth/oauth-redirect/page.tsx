import { redirect } from "next/navigation";
import OAuthRedirect from "./OAuthRedirect";
import { isRefreshTokenValid } from "@/app/utils/auth";

export default async function OAuthRedirectPage() {
      const verified = await isRefreshTokenValid()
      if (verified) {
        redirect('/dashboard')
      }
    return <OAuthRedirect />;
}