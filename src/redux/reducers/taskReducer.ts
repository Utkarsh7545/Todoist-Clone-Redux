import { ADD_TASK, REMOVE_TASK, UPDATE_TASK } from '../actions/taskActions';
import { Task } from '../../types/taskTypes';

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case REMOVE_TASK:
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => (task.id === action.payload.id ? action.payload : task)),
      };
    default:
      return state;
  }
};

export default taskReducer;
