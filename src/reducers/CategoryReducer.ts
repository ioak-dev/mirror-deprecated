import { FETCH_CATEGORY } from '../actions/types';

const initialState = {
  data: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CATEGORY:
      console.log('FETCH_CATEGORY reducer');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
