import { isRefreshTokenValid } from "@/app/utils/auth";
import ConfirmEmailComponent from "./ConfirmEmail";
import { redirect } from "next/navigation";

export default async function ConfirmEmailPage() {
    const verified = await isRefreshTokenValid()
    if (verified) {
      redirect('/dashboard')
    }
  return <ConfirmEmailComponent />;
}