import { AppDispatch } from "../store";
import {
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} from "../slices/authSlice";

export const logoutUser = () => async (dispatch: AppDispatch) => {
  dispatch(logoutRequest());
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Logout failed");
    }

    dispatch(logoutSuccess());
  } catch (error: any) {
    dispatch(logoutFailure(error.message || "Unknown error"));
  }
};