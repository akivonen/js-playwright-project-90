import { CreateUserData } from '../types';

export const usersPageUrl = 'users';

export const usersTableColumns = [
  'Id',
  'Email',
  'First name',
  'Last name',
  'Created at',
];

export const newUser: CreateUserData = {
  email: 'newuser1@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
};

export const editedUser: CreateUserData = {
  email: 'jackbauer@gmail.com',
  firstName: 'Jack',
  lastName: 'Bauer',
};
