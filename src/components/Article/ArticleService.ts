import axios from 'axios';
import { httpGet, httpPut, httpDelete } from '../Lib/RestTemplate';

import {
  sendMessage,
  newMessageId,
  httpHandleRequest,
  httpHandleResponse,
  httpHandleError,
  httpHandleResponseSilent,
  httpHandleErrorSilent,
} from '../../events/MessageService';

const domain = 'article';
const baseUrl = process.env.REACT_APP_API_URL;

export const saveArticle = async (space, payload, authorization) => {
  const action = 'Save article';
  const messageId = newMessageId();
  httpHandleRequest(messageId, action, payload.title);
  try {
    const response = await axios.put(`${baseUrl}/article/${space}/`, payload, {
      headers: {
        Authorization: authorization.token,
      },
    });
    return httpHandleResponse(messageId, response, action, payload.title);
  } catch (error) {
    return httpHandleError(messageId, error, action, payload.title);
  }
};

export const fetchArticle = async (space, id, authorization) => {
  try {
    const response = await axios.get(`${baseUrl}/article/${space}/${id}`, {
      headers: {
        Authorization: authorization.token,
      },
    });
    return httpHandleResponseSilent(response);
  } catch (error) {
    return httpHandleErrorSilent(error);
  }
};

export const deleteArticle = async (space, id, authorization) => {
  try {
    const response = await axios.get(`${baseUrl}/article/${space}/${id}`, {
      headers: {
        Authorization: authorization.token,
      },
    });
    return httpHandleResponseSilent(response);
  } catch (error) {
    return httpHandleErrorSilent(error);
  }
};
