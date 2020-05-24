import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OakButton from '../../../oakui/OakButton';
import { receiveMessage, sendMessage } from '../../../events/MessageService';
import { isEmptyOrSpaces } from '../../Utils';
import { saveArticle } from '../../../actions/ArticleActions';

const domain = 'article';
const queryString = require('query-string');

interface Props {
  data: any;
  profile: any;
  setProfile: Function;
  match: any;
  location: any;
  history: any;
}

const SaveItem = (props: Props) => {
  console.log(props);
  const dispatch = useDispatch();

  const authorization = useSelector(state => state.authorization);
  const [urlParam, setUrlParam] = useState({
    categoryid: '',
  });

  useEffect(() => {
    props.setProfile({
      ...props.profile,
      tenant: props.match.params.tenant,
    });
    setUrlParam(queryString.parse(props.location.search));
  }, []);

  useEffect(() => {
    const eventBus = receiveMessage().subscribe(message => {
      if (message.name === domain && message.signal) {
        sendMessage('notification', true, {
          type: 'success',
          message: `${domain} ${message.data.action}`,
          duration: 5000,
        });

        props.history.goBack();
      }
    });
    return () => eventBus.unsubscribe();
  });

  const validateEmptyText = (text, message) => {
    if (isEmptyOrSpaces(text)) {
      sendMessage('notification', true, {
        type: 'failure',
        message,
        duration: 5000,
      });
      return false;
    }
    return true;
  };

  const addArticle = () => {
    if (
      validateEmptyText(urlParam.categoryid, 'Provide the correct url') &&
      validateEmptyText(props.data.title, 'Title is not provided') &&
      validateEmptyText(
        props.data.description,
        'Provide details for the mentioned title'
      )
    ) {
      dispatch(
        saveArticle(props.profile.tenant, authorization, {
          category: urlParam.categoryid,
          title: props.data.title,
          description: props.data.description,
        })
      );
    }
  };

  return (
    <OakButton
      action={() => addArticle()}
      theme="primary"
      variant="disappear"
      align="right"
    >
      <i className="material-icons">double_arrow</i>Create
    </OakButton>
  );
};

export default SaveItem;
