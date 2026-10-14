import { File } from 'expo-file-system';

export interface Recognition {
  id: string;
  userId: string;
  name: string;
  confidence: number;
  imageUrl: string | null;
  createdAt: string;
}

export interface CreateRecognitionRequest {
  image: File;
  name: string;
  confidence: number;
}

export interface RecognitionResponse {
  success: boolean;
  recognition: Recognition;
}

export interface RecognitionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RecognitionHistoryResponse extends RecognitionPagination {
  success: boolean;
  recognitions: Recognition[];
}

export interface getRecognitionsParams {
  search: string | undefined,
  limit?: number | undefined,
  page: number | undefined,
}

export type ResponseData = {
  total: number;
  totalPages: number;
  totalActive: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
