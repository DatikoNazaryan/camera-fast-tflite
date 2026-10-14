import { createAsyncThunk } from '@reduxjs/toolkit';
import Api from '@src/Api';
import { CreateRecognitionRequest, getRecognitionsParams } from '@src/types/recognition';

export const getRecognitionsRequest =
  createAsyncThunk(
    'recognition/getRecognitions',
    async (payload: getRecognitionsParams, { rejectWithValue }) => {
      try {
        const { data } = await Api.getRecognitions(payload);

        return data;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ||
          'Failed to get recognition history',
        );
      }
    },
  );

export const createRecognitionRequest =
  createAsyncThunk(
    'recognition/createRecognition',
    async (
      data: CreateRecognitionRequest,
      { rejectWithValue },
    ) => {
      try {
        const response =
          await Api.createRecognition(data);

        return response.data.recognition;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ||
          'Failed to save recognition',
        );
      }
    },
  );

export const deleteRecognitionRequest =
  createAsyncThunk(
    'recognition/deleteRecognition',
    async (
      id: string,
      { rejectWithValue },
    ) => {
      try {
        await Api.deleteRecognition(id);

        return id;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data?.message ||
          'Failed to delete recognition',
        );
      }
    },
  );