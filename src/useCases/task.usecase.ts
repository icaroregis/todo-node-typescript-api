import { TasKRepository, Task, TaskCreateData, TaskUpdateData } from '../interfaces/task.interface';
import { TaskRepositoryPrisma } from '../repositories/task.repository';

//Regras de negócio
class TaskUseCase {
  private taskRepository: TasKRepository;

  constructor() {
    this.taskRepository = new TaskRepositoryPrisma();
  }

  async createTask({ name, userId }: TaskCreateData) {
    const contact = await this.taskRepository.create({
      name,
      userId,
    });

    return contact;
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
