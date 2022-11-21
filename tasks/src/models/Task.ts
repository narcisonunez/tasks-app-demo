interface Task {
  user_id: string;
  id: string;
  title: string;
  description: string;
  status: string;
}

enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  ARCHIVED = 'archived'
}

export { Task, TaskStatus }