import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../routes/user.routes';
import { UserRepositoryPrisma } from '../repositories/user.repository';
import { LoginResponse, LoginUser, User, UserCreate } from '../interfaces/user.interface';

//Regras de negócio
class UserUseCase {
  private userRepository: UserRepositoryPrisma;
  constructor() {
    this.userRepository = new UserRepositoryPrisma();
  }

  async createUser({ name, email, password }: UserCreate): Promise<User> {
    const verifyIfUserExist = await this.userRepository.findByEmail(email);

    if (verifyIfUserExist) {
      throw new Error('User already exists');
    }

    const result = await this.userRepository.create({ name, email, password });
    return result;
  }

  async login({ email, password }: LoginUser): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (password !== user.password) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return { token, userId: user.id };
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.userRepository.getAllUsers();
    return result;
  }

  async findByEmail(userEmail: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(userEmail);
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }
}

export { UserUseCase };
