import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface AccountState {
  AccountState: string;
}

// Initial state
const initialState: AccountState = {
  AccountState: "0x0000000000000000000000000000000000000000",
};

// Actual Slice
export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // Action to set the authentication status
    setAccountState(state, action) {
      state.AccountState = action.payload;
    },

    //Special reducer for hydrating the state. Special case for next-redux-wrapper
    // extraReducers: {
    //   [HYDRATE]: (state: any, action: any) => {
    //     return {
    //       ...state,
    //       ...action.payload.account,
    //     };
    //   },
    // },
  },
});

export const { setAccountState } = accountSlice.actions;

export const selectAccountState = (state: AppState) =>
  state.account.AccountState;

export default accountSlice.reducer;
