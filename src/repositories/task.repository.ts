import { prisma } from '../database/prisma-client';
import { TasKRepository, Task, TaskCreateData } from '../interfaces/task.interface';

//Operações do banco de dados.
class TaskRepositoryPrisma implements TasKRepository {
  async create(data: TaskCreateData): Promise<Task> {
    const result = await prisma.task.create({
      data: {
        name: data.name,
        completed: false,
        userId: data.userId,
      },
    });

    return result;
  }

  async getAllTasks(userId: string): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId,
      },
    });
    return tasks;
  }

  async deleteTask(taskId: string): Promise<void> {
    await prisma.task.delete({
      where: { id: taskId },
    });
  }
}

export { TaskRepositoryPrisma };
