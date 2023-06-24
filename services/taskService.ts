import { PrismaClient, Task } from "@prisma/client";

const prisma = new PrismaClient();

// npx prisma db push
// npx prisma generate

// Create a new task
const createTask = async (title: string, status: string) => {
  const task = await prisma.task.create({
    data: {
      title,
      status,
    },
  });
  return task;
};

// Get all taskList
async function fetchTaskLists(): Promise<any[]> {
  const taskLists = await prisma.taskList.findMany({
    include: {
      tasks: true,
    },
  });

  const jsonResult = taskLists.map((taskList) => ({
    id: taskList.id,
    title: taskList.title,
    tasks: taskList.tasks.map((task) => ({
      id: task.id,
      title: task.title,
    })),
  }));

  return jsonResult;
}

async function main() {
  try {
    const result = await fetchTaskLists();
    console.log(result);
  } catch (error) {
    console.error("Error retrieving task lists:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

// Get a task by ID
const getTaskById = async (taskId: number) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
  return task;
};

// Update a task
const updateTask = async (taskId: number, data: Partial<Task>) => {
  const task = await prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  });
  return task;
};

// Delete a task
const deleteTask = async (taskId: number) => {
  const task = await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
  return task;
};

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask };