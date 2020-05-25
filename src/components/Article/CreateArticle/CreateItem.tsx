import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OakText from '../../../oakui/OakText';
import OakEditor from '../../../oakui/OakEditor';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces } from '../../Utils';
import { sendMessage, receiveMessage } from '../../../events/MessageService';
import { saveArticle } from '../ArticleService';
import OakPrompt from '../../../oakui/OakPrompt';

const domain = 'article';

interface Props {
  urlParam: any;
  history: any;
  tenant: any;
}
const CreateItem = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [data, setData] = useState({
    title: '',
    description: '',
  });

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

  useEffect(() => {
    setData({
      title: '',
      description: '',
    });
  }, []);

  const handleChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

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
      validateEmptyText(data.title, 'Title is not provided') &&
      validateEmptyText(
        data.description,
        'Provide details for the mentioned title'
      )
    ) {
      saveArticle(
        props.tenant,
        {
          categoryId: props.urlParam.categoryid,
          title: data.title,
          description: data.description,
        },
        authorization
      );
    }
  };

  const cancelCreation = () => {
    props.history.goBack();
  };

  return (
    <div className="createArticle-item">
      <OakText
        label="Title"
        data={data}
        id="title"
        handleChange={e => handleChange(e)}
      />
      <OakEditor
        data={data}
        id="description"
        handleChange={e => handleChange(e)}
      />
      <div className="article-action">
        <OakButton
          action={() => addArticle()}
          theme="primary"
          variant="disappear"
          align="right"
        >
          <i className="material-icons">double_arrow</i>Save
        </OakButton>
        <OakButton
          action={() => cancelCreation()}
          theme="primary"
          variant="disappear"
          align="right"
        >
          <i className="material-icons secondary">double_arrow</i>Cancel
        </OakButton>
      </div>
    </div>
  );
};
export default CreateItem;
