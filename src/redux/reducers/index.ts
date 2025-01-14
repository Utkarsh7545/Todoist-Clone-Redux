import { combineReducers } from 'redux';
import taskReducer from './taskReducer';
import projectReducer from './projectReducer';

const rootReducer = combineReducers({
  task: taskReducer,
  project: projectReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
