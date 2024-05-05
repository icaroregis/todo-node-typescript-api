import { TasKRepository, Task, TaskCreateData, TaskUpdateData } from '../interfaces/task.interface';
import { TaskRepositoryPrisma } from '../repositories/task.repository';

//Regras de negócio
class TaskUseCase {
  private taskRepository: TasKRepository;

  constructor() {
    this.taskRepository = new TaskRepositoryPrisma();
  }

  async createTask({ name, userId }: TaskCreateData) {
    const existingTask = await this.taskRepository.getAllTasks(userId);
    const taskExists = existingTask.some((task) => task.name === name);

    if (taskExists) {
      throw new Error('A task with the same name already exists for this user');
    }

    const task = await this.taskRepository.create({ name, userId });
    return task;
  }

  async getAllTasks(userId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.getAllTasks(userId);
    return tasks;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.taskRepository.deleteTask(taskId);
  }

  async updateTask(taskId: string, data: TaskUpdateData) {
    const updatedTask = await this.taskRepository.updateTask(taskId, data);
    if (!updatedTask) {
      throw new Error('Task not found');
    }
    return updatedTask;
  }
}

export { TaskUseCase };
