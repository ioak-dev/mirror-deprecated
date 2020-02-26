import { httpGet, httpPut, httpDelete } from '../components/Lib/RestTemplate';
import {constants} from '../components/Constants';
import { FETCH_ARTICLE } from './types';
import { sendMessage } from '../events/MessageService';

const domain = 'servicerequests';

export const fetchRequest = (tenant, authorization) => dispatch => {
    httpGet(constants.API_URL_FAQ + '/' + 
    tenant + '/',
      {
        headers:{
          Authorization: authorization.token
        }
      })
      .then((response) => {
          dispatch({
              type: FETCH_ARTICLE,
              payload: {items: response.data.faq, categories: response.data.category}
          })
      })
};

export const saveRequest = (tenant, authorization, payload) => dispatch => {
    httpPut(constants.API_URL_FAQ + '/' + 
    tenant + '/',
    payload,
    {
      headers: {
        Authorization: authorization.token
      }
    })
    .then(response => {
        if (response.status === 200) {
            // sendMessage('notification', true, {type: 'success', message: 'FAQ created', duration: 5000});
            sendMessage(domain, true, { action: payload.id ? 'updated' : 'created' });
            dispatch(fetchRequest(tenant, authorization));
        }
    })
    .catch((error) => {
        if (error.response.status === 401) {
            sendMessage('session expired');
        }
    })
}

export const deleteRequest = (tenant, authorization, id) => dispatch => {
    httpDelete(constants.API_URL_FAQ + '/' + tenant + '/' + id,
    {
      headers: {
        Authorization: authorization.token
      }
    })
    .then(response => {
        if (response.status === 200) {
            // sendMessage('notification', true, {type: 'success', message: 'FAQ deleted', duration: 5000});
            sendMessage(domain, true, { action: 'deleted' });
            dispatch(fetchRequest(tenant, authorization));
        }
    })
    .catch((error) => {
        if (error.response.status === 401) {
            sendMessage('session expired');
        }
    })
};
