import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  userId: number;
  username: string;
  email: string;
  provider: string;
}

interface AuthState {
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  isLoading: boolean;
  user: AuthUser | null;
  error: any | null;
  message: string | null;
}

const initialState: AuthState = {
  status: "idle",
  isLoading: false,
  user: null,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state) {
      state.status = "loading"
      state.isLoading = true
    },
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.status = "authenticated"
      state.isLoading = false
      state.error = null
    },
    loginFailure(state, action: PayloadAction<any>) {
      state.status = "unauthenticated"
      state.error = action.payload
      state.isLoading = false
    },
    checkRequest(state) {
      state.status = "loading"
      state.isLoading = true
    },
    checkSuccess(state) {
      state.status = "authenticated"
      state.isLoading = false
      state.error = null
    },
    checkFailure(state, action: PayloadAction<any>) {
      state.status = "unauthenticated"
      state.error = action.payload
      state.isLoading = false
      state.user = null
    },
    registerRequest(state) {
      state.status = "loading"
      state.isLoading = true
    },
    registerSuccess(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = null
      state.message = action.payload
    },
    registerFailure(state, action: PayloadAction<any>) {
      state.error = action.payload
      state.isLoading = false
    },
    logoutRequest(state) {
      state.status = "loading"
      state.isLoading = true
    },
    logoutSuccess(state) {
      state.status = "unauthenticated"
      state.isLoading = false
      state.error = null
      state.user = null
    },
    logoutFailure(state, action: PayloadAction<any>) {
      state.error = action.payload
      state.isLoading = false
    },
    changePasswordRequest(state) {
      state.isLoading = true
    },
    changePasswordSuccess(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = null
      state.message = action.payload
    },
    changePasswordFailure(state, action: PayloadAction<any>) {
      state.error = action.payload
      state.isLoading = false
    },
    confirmCodeRequest(state) {
      state.isLoading = true
    },
    confirmCodeSuccess(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = null
      state.message = action.payload
    },
    confirmCodeFailure(state, action: PayloadAction<any>) {
      state.error = action.payload
      state.isLoading = false
    },
  }
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  checkRequest,
  checkSuccess,
  checkFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  confirmCodeRequest,
  confirmCodeSuccess,
  confirmCodeFailure,
} = authSlice.actions;
export default authSlice.reducer;