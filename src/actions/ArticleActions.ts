import { httpGet, httpPut, httpDelete } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';
import { FETCH_ARTICLE } from './types';
import { sendMessage } from '../events/MessageService';

const domain = 'article';

export const fetchArticle = (tenant, authorization) => dispatch => {
  httpGet(`/article/${tenant}/`, {
    headers: {
      Authorization: authorization.token,
    },
  }).then(response => {
    console.log(response);
    dispatch({
      type: FETCH_ARTICLE,
      payload: { items: response.data.data },
    });
  });
};

export const saveArticle = (tenant, authorization, payload) => dispatch => {
  httpPut(`${constants.API_URL_FAQ}/${tenant}/`, payload, {
    headers: {
      Authorization: authorization.token,
    },
  })
    .then(response => {
      if (response.status === 200) {
        // sendMessage('notification', true, {type: 'success', message: 'FAQ created', duration: 5000});
        sendMessage(domain, true, {
          action: payload.id ? 'updated' : 'created',
        });
        dispatch(fetchArticle(tenant, authorization));
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};

export const deleteArticle = (tenant, authorization, id) => dispatch => {
  httpDelete(`${constants.API_URL_FAQ}/${tenant}/${id}`, {
    headers: {
      Authorization: authorization.token,
    },
  })
    .then(response => {
      if (response.status === 200) {
        // sendMessage('notification', true, {type: 'success', message: 'FAQ deleted', duration: 5000});
        sendMessage(domain, true, { action: 'deleted' });
        dispatch(fetchArticle(tenant, authorization));
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};
