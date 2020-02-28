import { FETCH_STAGE } from '../actions/types';

const initialState = {
  data: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_STAGE:
      console.log('FETCH_STAGE reducer');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
