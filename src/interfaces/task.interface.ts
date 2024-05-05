export interface Task {
  id: string;
  name: string;
  completed: boolean;
  userId: string;
}

export interface TaskCreateData {
  name: string;
  userId: string;
}

export interface TaskUpdateData {
  name: string;
}

export interface TasKRepository {
  create(data: TaskCreateData): Promise<Task>;
  getAllTasks(userId: string): Promise<Task[]>;
  deleteTask(taskId: string): Promise<void>;
  updateTask(taskId: string, data: TaskUpdateData): Promise<Task | null>;
}
