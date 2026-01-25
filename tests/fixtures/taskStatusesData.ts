import { TaskStatus, CreateTaskStatusData } from '../types';

export const newTaskStatus: CreateTaskStatusData = {
  name: 'Test Status',
  slug: 'test_status',
};

export const editedTaskStatus: CreateTaskStatusData = {
  name: 'Edited Status',
  slug: 'edited_status',
};

export const taskStatusPageUrl = 'task_statuses';

export const taskStatusesTableColumns = ['Id', 'Name', 'Slug', 'Created at'];

export const initTaskStatusesList: TaskStatus[] = [
  {
    id: 1,
    name: 'Draft',
    slug: 'draft',
  },
  {
    id: 2,
    name: 'To Review',
    slug: 'to_review',
  },
  {
    id: 3,
    name: 'To Be Fixed',
    slug: 'to_be_fixed',
  },
  {
    id: 4,
    name: 'To Publish',
    slug: 'to_publish',
  },
  {
    id: 5,
    name: 'Published',
    slug: 'published',
  },
];
