import { Project } from '../../types/projectTypes';

export const ADD_PROJECT = 'ADD_PROJECT';
export const REMOVE_PROJECT = 'REMOVE_PROJECT';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';

export const addProject = (project: Project) => ({
  type: ADD_PROJECT,
  payload: project,
});

export const removeProject = (id: string) => ({
  type: REMOVE_PROJECT,
  payload: id,
});

export const updateProject = (project: Project) => ({
  type: UPDATE_PROJECT,
  payload: project,
});
