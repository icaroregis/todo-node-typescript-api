import jwt from 'jsonwebtoken';
import { prisma } from '../database/prisma-client';
import { JWT_SECRET } from '../routes/user.routes';
import { LoginUser, User, UserCreate, UserRepository } from '../interfaces/user.interface';

//Operações do banco de dados.
class UserRepositoryPrisma implements UserRepository {
  async create(data: UserCreate): Promise<User> {
    const result = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
    return result;
  }

  async login({ email, password }: LoginUser): Promise<{ token: string; userId: string }> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '10h' });
    return { token, userId: user.id };
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    return result || null;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}

export { UserRepositoryPrisma };
