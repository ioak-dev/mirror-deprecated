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
  id: string;
  categoryId: string;
  history: any;
  space: any;
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
    (async function anonymous() {
      if (props.authorization.token && props.id) {
        const { outcome, response } = await fetchArticle(
          props.space,
          props.id,
          props.authorization
        );

        if (outcome) {
          setData(response.data.data);
        }
      }
    })();
  }, [props.id, props.authorization]);

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

  const updateArticle = async () => {
    if (
      validateEmptyText(data.title, 'Title is not provided') &&
      validateEmptyText(
        data.description,
        'Provide details for the mentioned title'
      )
    ) {
      const { outcome } = await saveArticle(
        props.space,
        {
          _id: data._id,
          categoryId: data.categoryId,
          title: data.title,
          description: data.description,
          tags: data.tags,
        },
        authorization
      );

      if (outcome) {
        props.history.goBack();
      }
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
        {props.history.length > 2 && (
          <OakButton
            action={() => cancelCreation()}
            theme="default"
            variant="appear"
          >
            <i className="material-icons">close</i>Cancel
          </OakButton>
        )}
      </div>
      <div className="user-form">
        <CategoryTree id={props.categoryId} />
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
          handleChange={handleChange}
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
