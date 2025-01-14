import { Task } from '../../types/taskTypes';

export const ADD_TASK = 'ADD_TASK';
export const REMOVE_TASK = 'REMOVE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';

export const addTask = (task: Task) => ({
  type: ADD_TASK,
  payload: task,
});

export const removeTask = (id: string) => ({
  type: REMOVE_TASK,
  payload: id,
});

export const updateTask = (task: Task) => ({
  type: UPDATE_TASK,
  payload: task,
});
