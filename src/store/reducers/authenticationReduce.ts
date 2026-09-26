import { createReducer } from '@reduxjs/toolkit';
import Account from '@src/utils/Account';
import { User } from '@src/types/user';

import {
  registrationRequest,
  loginRequest,
  updateUserRequest,
  logOut,
} from '../actions/authenticationAction';

type AuthState = {
  requestMessage: string;
  loginRequestMessage: string;
  verifyRequestMessage: string;
  profileRequestMessage: string;
  user: User | null | undefined;
  token: string | null;
};

const initialState: AuthState = {
  requestMessage: '',
  loginRequestMessage: '',
  verifyRequestMessage: '',
  profileRequestMessage: '',
  user: Account.profile,
  token: Account.token,
};

export default createReducer(
  initialState,
  (builder) => {
    builder
      .addCase(logOut, (state) => {
        state.token = '';
        state.user = null;
        Account.clear();
      })
      .addCase(registrationRequest.pending, (state) => {
          state.requestMessage = 'request';
        },
      )
      .addCase(
        registrationRequest.fulfilled, (state, action) => {
          state.requestMessage = 'success';
          state.token = action.payload.token;
          state.user = action.payload.user;

          Account.token = action.payload.token;
          Account.profile = action.payload.user;
        },
      )
      .addCase(
        registrationRequest.rejected, (state) => {state.requestMessage = 'rejected';
        },
      )
      .addCase(loginRequest.pending, (state) => {
          state.loginRequestMessage = 'request';
        },
      )
      .addCase(loginRequest.fulfilled, (state, action) => {
          state.loginRequestMessage = 'success';
          state.token = action.payload.token;
          state.user = action.payload.user;

          Account.token = action.payload.token;
          Account.profile = action.payload.user;
        },
      )
      .addCase(loginRequest.rejected, (state) => {
          state.loginRequestMessage = 'rejected';
        },
      )
      .addCase(updateUserRequest.pending, (state) => {
          state.profileRequestMessage = 'request';
        },
      )

      .addCase(updateUserRequest.fulfilled, (state, action) => {
          state.profileRequestMessage = 'success';
          state.user = action.payload.user;

          Account.profile = action.payload.user;
        },
      )

      .addCase(updateUserRequest.rejected, (state) => {
          state.profileRequestMessage = 'rejected';
        },
      );
  },
);