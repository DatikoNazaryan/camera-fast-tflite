import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '@/src/Api';
import { UserRegisterRequest, UserLoginRequest, UpdateUserRequest } from '@/src/types/user';

export const registrationRequest = createAsyncThunk(
  'auth/register',
  async (payload: UserRegisterRequest, thunkAPI) => {
    try {
      const { data } = await Api.registration(payload);
      return data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data);
    }
  }
);

export const loginRequest = createAsyncThunk(
  'auth/login',
  async (payload: UserLoginRequest, thunkAPI) => {
    try {
      const { data } = await Api.login(payload);
      return data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data);
    }
  }
);

export const updateUserRequest = createAsyncThunk(
  'auth/updateUser',
  async (payload: UpdateUserRequest, thunkAPI,) => {
    try {
      const { data } = await Api.updateUser(payload);

      return data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        e.response?.data,
      );
    }
  },
);

export const logOut = createAction('logOut');
