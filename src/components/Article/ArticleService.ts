import { httpGet, httpPut, httpDelete } from '../Lib/RestTemplate';
import constants from '../Constants';
import { sendMessage } from '../../events/MessageService';

const domain = 'article';

export const saveArticle = (tenant, payload, authorization) => {
  httpPut(`${constants.API_URL_ARTICLE}/${tenant}/`, payload, {
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

export function fetchArticle(tenant, articleid, headers) {
  return httpGet(
    `${constants.API_URL_ARTICLE}/${tenant}/${articleid}`,
    headers
  ).then(function(response) {
    return Promise.resolve(response.data);
  });
}

export function deleteArticle(tenant, articleid, headers) {
  return httpDelete(
    `${constants.API_URL_ARTICLE}/${tenant}/${articleid}`,
    headers
  ).then(function(response) {
    if (response.status === 200) {
      sendMessage(domain, true, {
        action: `deleted'`,
      });
    }
  });
}
