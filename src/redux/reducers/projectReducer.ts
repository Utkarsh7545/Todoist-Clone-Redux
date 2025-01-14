import { ADD_PROJECT, REMOVE_PROJECT, UPDATE_PROJECT } from '../actions/projectActions';
import { Project } from '../../types/projectTypes';

interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [],
};

const projectReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_PROJECT:
      return { ...state, projects: [...state.projects, action.payload] };
    case REMOVE_PROJECT:
      return { ...state, projects: state.projects.filter(project => project.id !== action.payload) };
    case UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(project => (project.id === action.payload.id ? action.payload : project)),
      };
    default:
      return state;
  }
};

export default projectReducer;
