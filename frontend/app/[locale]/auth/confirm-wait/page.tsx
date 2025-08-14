import { isRefreshTokenValid } from "@/app/utils/auth";
import ConfirmEmailWaitComponent from "./ConfirmEmailWait";
import { redirect } from "next/navigation";

export default async function ConfirmEmailWaitPage() {
    const verified = await isRefreshTokenValid()
    if (verified) {
      redirect('/dashboard')
    }
  return <ConfirmEmailWaitComponent />
}