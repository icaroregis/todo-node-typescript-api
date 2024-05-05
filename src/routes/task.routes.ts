import { FastifyInstance, FastifyRequest } from 'fastify';
import { TaskUseCase } from '../useCases/task.usecase';
import { Task, TaskCreateData } from '../interfaces/task.interface';
import { authenticateJWT } from '../middleware/authenticateJWT';

interface QueryParams {
  userId: string;
}

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    reply.header('Access-Control-Allow-Headers', 'Content-Type');
    done();
  });
  const taskUseCase = new TaskUseCase();

  fastify.post<{ Body: TaskCreateData }>('/', async (request, reply) => {
    const { name, userId } = request.body;
    try {
      const data = await taskUseCase.createTask({
        name,
        userId,
      });
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.get('/', async (request: FastifyRequest<{ Querystring: QueryParams }>, reply) => {
    const { userId }: QueryParams = request.query;
    try {
      const tasks: Task[] = await taskUseCase.getAllTasks(userId);
      return reply.send(tasks);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.delete<{ Params: { taskId: string } }>(
    '/:taskId',
    { preHandler: authenticateJWT },
    async (request, reply) => {
      const { taskId } = request.params;
      try {
        await taskUseCase.deleteTask(taskId);
        reply.send({ message: 'Task deleted successfully' });
      } catch (error) {
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    },
  );
}
