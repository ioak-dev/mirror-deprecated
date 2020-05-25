import { httpGet, httpPut, httpDelete } from '../Lib/RestTemplate';
import constants from '../Constants';
import { sendMessage } from '../../events/MessageService';

const domain = 'article';

export const saveArticle = (tenant, payload, authorization) => {
  httpPut(`${constants.API_URL_FAQ}/${tenant}/`, payload, {
    headers: {
      Authorization: authorization.token,
    },
  }).then(response => {
    if (response.status === 200) {
      sendMessage(domain, true, {
        action: payload.id ? 'updated' : 'created',
      });
    }
  });
};

export const fetchArticle = (tenant, authorization, category?, searchText?) => {
  if (category) {
    httpGet(`${constants.API_URL_FAQ}/${tenant}/${category}`, {
      headers: {
        Authorization: authorization.token,
      },
    }).then(response => {
      return Promise.resolve(response.data);
    });
  }
};
