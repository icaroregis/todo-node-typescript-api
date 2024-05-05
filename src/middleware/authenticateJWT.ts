import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../routes/user.routes';

const authenticateJWT = async (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) {
    reply.status(401).send({ error: 'Unauthorized: Token missing' });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string };

    done();
  } catch (error) {
    reply.status(401).send({ error: 'Unauthorized: Invalid token' });
  }
};

export { authenticateJWT };
