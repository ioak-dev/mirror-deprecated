import { FETCH_REQUEST } from '../actions/types';

const initialState = {
  items: [],
  logs: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_REQUEST:
      console.log('FETCH_REQUEST reducer');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
