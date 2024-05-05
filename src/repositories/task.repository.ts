import { prisma } from '../database/prisma-client';
import { TasKRepository, Task, TaskCreateData, TaskUpdateData } from '../interfaces/task.interface';

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

  async updateTask(taskId: string, data: TaskUpdateData): Promise<Task | null> {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return null;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        name: data.name,
      },
    });

    return updatedTask;
  }
}

export { TaskRepositoryPrisma };
