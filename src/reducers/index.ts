import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';
import UserReducer from './UserReducer';
import ArticleReducer from './ArticleReducer';

export default combineReducers({
    authorization: AuthReducer,
    profile: ProfileReducer,
    user: UserReducer,
    article: ArticleReducer
})