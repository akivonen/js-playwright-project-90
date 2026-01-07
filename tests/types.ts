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
