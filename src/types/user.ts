export interface  UserRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface  UserLoginRequest {
  email: string;
  password: string;
}

export type UpdateUserField = 'name' | 'password';

export interface UpdateUserRequest {
  userId: string;
  field: UpdateUserField;
  value: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};
