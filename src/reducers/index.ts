import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';
import UserReducer from './UserReducer';
import ArticleReducer from './ArticleReducer';
import RequestReducer from './RequestReducer';
import StageReducer from './StageReducer';

export default combineReducers({
    authorization: AuthReducer,
    profile: ProfileReducer,
    user: UserReducer,
    article: ArticleReducer,
    request: RequestReducer,
    stage: StageReducer
})