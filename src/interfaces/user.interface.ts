export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreate {
  email: string;
  name: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface UserRepository {
  create(data: UserCreate): Promise<User>;
  login(data: LoginUser): Promise<LoginResponse>;
  findByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  deleteUser(userId: string): Promise<void>;
}
