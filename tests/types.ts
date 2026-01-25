export type UserCredentials = {
  username: string;
  password: string;
};

export type CreateUserData = {
  email: string;
  firstName: string;
  lastName: string;
};

export type User = CreateUserData & { id: number };

export type CreateTaskStatusData = {
  name: string;
  slug: string;
};

export type TaskStatus = CreateTaskStatusData & { id: number };
