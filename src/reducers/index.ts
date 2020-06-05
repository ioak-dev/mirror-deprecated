import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';
import UserReducer from './UserReducer';
import CategoryReducer from './CategoryReducer';
import RequestReducer from './RequestReducer';
import StageReducer from './StageReducer';

export default combineReducers({
  authorization: AuthReducer,
  profile: ProfileReducer,
  user: UserReducer,
  category: CategoryReducer,
  request: RequestReducer,
  stage: StageReducer,
});
