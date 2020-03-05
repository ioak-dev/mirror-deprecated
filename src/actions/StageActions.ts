import { httpGet, httpPut, httpDelete } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';
import { FETCH_STAGE } from './types';
import { sendMessage } from '../events/MessageService';

const domain = 'stage';

export const fetchStage = (tenant, authorization) => dispatch => {
  httpGet(`${constants.API_URL_STAGE}/${tenant}/`, {
    headers: {
      Authorization: authorization.token,
    },
  }).then(response => {
    dispatch({
      type: FETCH_STAGE,
      payload: { data: response.data.stage },
    });
  });
};

export const saveStage = (tenant, authorization, payload) => dispatch => {
  return httpPut(`${constants.API_URL_STAGE}/${tenant}/`, payload, {
    headers: {
      Authorization: authorization.token,
    },
  })
    .then(response => {
      if (response.status === 200) {
        // sendMessage('notification', true, {type: 'success', message: 'FAQ created', duration: 5000});
        sendMessage(domain, true, { action: 'updated' });
        dispatch(fetchStage(tenant, authorization));
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};

export const deleteStage = (tenant, authorization, id) => dispatch => {
  httpDelete(`${constants.API_URL_STAGE}/${tenant}/${id}`, {
    headers: {
      Authorization: authorization.token,
    },
  })
    .then(response => {
      if (response.status === 200) {
        // sendMessage('notification', true, {type: 'success', message: 'FAQ deleted', duration: 5000});
        sendMessage(domain, true, { action: 'deleted' });
        dispatch(fetchStage(tenant, authorization));
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};
