import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OakText from '../../../oakui/OakText';
import OakEditor from '../../../oakui/OakEditor';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces } from '../../Utils';
import { sendMessage, receiveMessage } from '../../../events/MessageService';
import { saveArticle, fetchArticle } from '../ArticleService';
import CategoryTree from '../../Category/CategoryTree';

const domain = 'article';

interface Props {
  urlParam: any;
  history: any;
  tenant: any;
  authorization: any;
}
const EditItem = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [data, setData] = useState({
    title: '',
    description: '',
    tags: '',
    categoryId: '',
    _id: '',
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
    if (props.authorization.token && props.urlParam.articleid) {
      fetchArticle(props.tenant, props.urlParam.articleid, {
        headers: {
          Authorization: props.authorization.token,
        },
      }).then(response => {
        if (response.data) {
          response.data.map(item => {
            setData({
              _id: item._id,
              title: item.title,
              description: item.description,
              tags: item.tags,
              categoryId: item.categoryId,
            });
          });
        }
      });
    }
  }, [props.urlParam, props.authorization]);

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

  const updateArticle = () => {
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
          _id: data._id,
          categoryId: data.categoryId,
          title: data.title,
          description: data.description,
          tags: data.tags,
        },
        authorization
      );
    }
  };

  const cancelCreation = () => {
    props.history.goBack();
  };

  return (
    <div className="create-article-item">
      <div className="action-header position-right">
        <OakButton
          action={() => updateArticle()}
          theme="primary"
          variant="appear"
        >
          <i className="material-icons">double_arrow</i>Save
        </OakButton>
        <OakButton
          action={() => cancelCreation()}
          theme="default"
          variant="appear"
        >
          <i className="material-icons">close</i>Cancel
        </OakButton>
      </div>
      <div className="user-form">
        <CategoryTree id={props.urlParam.categoryid} />
        <OakText
          label="Title"
          data={data}
          id="title"
          handleChange={e => handleChange(e)}
        />
        <OakEditor
          label="Description"
          data={data}
          id="description"
          handleChange={e => handleChange(e)}
        />
        <OakText
          label="Tags (comma separated list)"
          data={data}
          id="tags"
          handleChange={e => handleChange(e)}
        />
      </div>
    </div>
  );
};
export default EditItem;
