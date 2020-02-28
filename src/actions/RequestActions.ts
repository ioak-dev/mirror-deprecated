import { httpGet, httpPut, httpDelete } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';
import { FETCH_REQUEST } from './types';
import { sendMessage } from '../events/MessageService';

const domain = 'servicerequests';
const domainLog = 'servicerequests log';

export const fetchRequest = (tenant, authorization) => dispatch => {
  httpGet(`${constants.API_URL_SR}/${tenant}/main`, {
    headers: {
      Authorization: authorization.token,
    },
  }).then(response => {
    dispatch({
      type: FETCH_REQUEST,
      payload: { items: response.data.data },
    });
  });
};

export const saveRequest = (tenant, authorization, payload) => dispatch => {
  httpPut(`${constants.API_URL_SR}/${tenant}/main`, payload, {
    headers: {
      Authorization: authorization.token,
    },
  })
    .then(response => {
      if (response.status === 200) {
        sendMessage(domain, true, {
          action: payload.id ? 'updated' : 'created',
        });
        dispatch(fetchRequest(tenant, authorization));
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};

export const deleteRequest = (tenant, authorization, id) => dispatch => {
  httpDelete(`${constants.API_URL_FAQ}/${tenant}/${id}`, {
    headers: {
      Authorization: authorization.token,
    },
  })
    .then(response => {
      if (response.status === 200) {
        // sendMessage('notification', true, {type: 'success', message: 'FAQ deleted', duration: 5000});
        sendMessage(domain, true, { action: 'deleted' });
        dispatch(fetchRequest(tenant, authorization));
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};

export const fetchRequestLog = (tenant, authorization, id) => dispatch => {
  httpGet(`${constants.API_URL_SR}/${tenant}/log/${id}`, {
    headers: {
      Authorization: authorization.token,
    },
  }).then(response => {
    dispatch({
      type: FETCH_REQUEST,
      payload: { logs: response.data.data },
    });
  });
};

export const saveRequestLog = (tenant, authorization, payload) => dispatch => {
  httpPut(
    `${constants.API_URL_SR}/${tenant}/log` + `/${payload.requestId}`,
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      request_id: payload.requestId,
      comments: payload.comments,
    },
    {
      headers: {
        Authorization: authorization.token,
      },
    }
  )
    .then(function(response) {
      if (response.status === 200) {
        sendMessage(domainLog, true, {
          action: payload.id ? 'updated' : 'created',
        });
        dispatch(fetchRequestLog(tenant, authorization, payload.requestId));
        // sendMessage('notification', true, {type: 'success', message: 'Comments Added  Successfully', duration: 5000});
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};
