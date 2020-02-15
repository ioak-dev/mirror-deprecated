import { GET_USER, ADD_USER } from './types';

export const getUser = () => dispatch => {
    dispatch({
        type: GET_USER
    });
}

export const addUser = (data) => dispatch => {
    dispatch({
        type: ADD_USER,
        payload: data
    });
}