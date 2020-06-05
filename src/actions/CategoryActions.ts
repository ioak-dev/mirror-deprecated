/* eslint-disable import/prefer-default-export */
import { httpGet, httpPut, httpDelete } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';
import { FETCH_CATEGORY } from './types';
import { sendMessage } from '../events/MessageService';

const domain = 'article';

export const fetchArticle = (tenant, authorization) => dispatch => {
  httpGet(`/article/${tenant}/`, {
    headers: {
      Authorization: authorization.token,
    },
  }).then(response => {
    dispatch({
      type: FETCH_CATEGORY,
      payload: { items: response.data.data },
    });
  });
};
