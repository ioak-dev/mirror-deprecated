import { FETCH_ARTICLE } from '../actions/types';

const initialState = {
  items: [],
  categories: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_ARTICLE:
      console.log('FETCH_ARTICLE reducer');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
