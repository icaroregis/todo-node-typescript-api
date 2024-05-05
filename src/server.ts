import fastify, { FastifyInstance } from 'fastify';
import { userRoutes } from './routes/user.routes';
import { taskRoutes } from './routes/task.routes';
import cors from '@fastify/cors';

const app: FastifyInstance = fastify({ logger: true });

app.register(cors, {
  origin: '*',
  credentials: true,
});
app.register(userRoutes, {
  prefix: '/users',
});
app.register(taskRoutes, {
  prefix: '/tasks',
});
app.listen({ port: 3000 }, () => console.log('Server is running on port 3000'));
