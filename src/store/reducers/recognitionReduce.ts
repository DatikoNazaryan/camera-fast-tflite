import { createReducer } from '@reduxjs/toolkit';
import { Recognition, ResponseData } from '@src/types/recognition';
import mergeUniqueLast from '@src/utils/mergeUniqueLast';
import storage from '@src/utils/storage';

import {
  getRecognitionsRequest,
  createRecognitionRequest,
  deleteRecognitionRequest,
} from '../actions/recognitionAction';

type RecognitionState = {
  requestMessage: string;
  recognitions: Recognition[];
  recognitionsListData: ResponseData;
};

const initialState: RecognitionState = {
  requestMessage: '',
  recognitions: storage.getArray('recognitions') || [],
  recognitionsListData: {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
    totalActive: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(getRecognitionsRequest.pending, (state) => {
      state.requestMessage = 'request';
    })
    .addCase(getRecognitionsRequest.fulfilled, (state, action) => {
      const {
        recognitions,
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      } = action.payload;

      state.recognitions = page === 1 ? recognitions : mergeUniqueLast(state.recognitions, recognitions);

      state.recognitionsListData = {
        ...state.recognitionsListData,
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };

      storage
        .setArrayAsync('recognitions', state.recognitions)
        .catch(console.error);

      state.requestMessage = 'success';
    })
    .addCase(getRecognitionsRequest.rejected, (state) => {
      state.requestMessage = 'rejected';
    })
    .addCase(createRecognitionRequest.pending, (state) => {
      state.requestMessage = 'request';
    })
    .addCase(createRecognitionRequest.fulfilled, (state, action) => {
      state.requestMessage = 'success';
      state.recognitions = [
        action.payload,
        ...state.recognitions.filter(
          (item) => item.id !== action.payload.id,
        ),
      ];
    })
    .addCase(createRecognitionRequest.rejected, (state) => {
      state.requestMessage = 'rejected';
    })
    .addCase(deleteRecognitionRequest.pending, (state) => {
      state.requestMessage = 'request';
    })
    .addCase(deleteRecognitionRequest.fulfilled, (state, action) => {
      state.requestMessage = 'success';
      state.recognitions = state.recognitions.filter(
        (item) => item.id !== action.payload,
      );

      state.recognitionsListData.total = Math.max(
        0,
        state.recognitionsListData.total - 1,
      );

      storage
        .setArrayAsync('recognitions', state.recognitions)
        .catch(console.error);
    })
    .addCase(deleteRecognitionRequest.rejected, (state) => {
      state.requestMessage = 'rejected';
    });
});
