import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { UserUseCase } from '../useCases/user.usecase';
import { UserCreate } from '../interfaces/user.interface';
import { authenticateJWT } from '../middleware/authenticateJWT';

export const JWT_SECRET = '123456';

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase();
  fastify.post<{ Body: UserCreate }>('/register', async (request, reply) => {
    const { name, email, password } = request.body;
    try {
      const data = await userUseCase.createUser({ name, email, password });
      reply.status(200).send(data);
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.post<{ Body: { email: string; password: string } }>('/login', async (request, reply) => {
    const { email, password } = request.body;
    try {
      const user = await userUseCase.findByEmail(email);
      if (!user) {
        reply.status(401).send({ error: 'Invalid credentials' });
        return;
      }

      if (password !== user.password) {
        reply.status(401).send({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '10h' });
      reply.status(200).send({ token, userId: user.id });
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/', async (request, reply) => {
    try {
      const users = await userUseCase.getAllUsers();
      reply.status(200).send(users);
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const userId = request.params.id;
    try {
      await userUseCase.deleteUser(userId);
      reply.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
