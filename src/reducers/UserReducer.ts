import { GET_USER, ADD_USER } from '../actions/types';

const initialState = {
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_USER:
            console.log('GET_USER reducer');
            return {
                ...state
            };
        case ADD_USER:
            console.log('ADD_USER reducer');
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}