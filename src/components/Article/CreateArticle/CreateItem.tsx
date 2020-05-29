import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OakText from '../../../oakui/OakText';
import OakEditor from '../../../oakui/OakEditor';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces } from '../../Utils';
import { sendMessage, receiveMessage } from '../../../events/MessageService';
import { saveArticle } from '../ArticleService';
import CategoryTree from '../../Category/CategoryTree';
import OakChipGroup from '../../../oakui/OakChipGroup';

const domain = 'article';

interface Props {
  urlParam: any;
  history: any;
  space: any;
}
const CreateItem = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [data, setData] = useState<any>({
    title: '',
    description: '',
    tags: [],
    addTags: [],
    removeTags: [],
  });
  const [view, setView] = useState<any>({
    tags: [],
  });

  const globalTags = [
    'int',
    'lorem',
    'ipsum',
    'dolor',
    'wrsedfdsf',
    'fgfdgyy',
    'ujku',
    'fre546',
    'yudsf',
    'uiasedas',
    'y78sd',
  ];

  const globalTagsObjects = [
    {
      key: 'internet',
      value: 'Internet',
    },
    {
      key: 'web',
      value: 'Web',
    },
    {
      key: 'lorem',
      value: 'Lorem ipsum',
    },
    {
      key: 'dolor',
      value: 'Dolor sit',
    },
    {
      key: 'loremdolor',
      value: 'Lorem ipsum, dolor sit',
    },
  ];

  useEffect(() => {
    setData({
      title: '',
      description: '',
      tags: [],
      addTags: [],
      removeTags: [],
    });
  }, []);

  useEffect(
    () =>
      setView({
        ...view,
        tags: [...data.tags, ...data.addTags].filter(
          item => !data.removeTags.includes(item)
        ),
      }),
    [data.addTags, data.tags, data.removeTags]
  );

  const handleChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleTagAddition = key => {
    if (!data.tags.includes(key)) {
      setData({
        ...data,
        addTags: [...data.addTags, key],
        removeTags: data.removeTags.filter(item => item !== key),
      });
    } else {
      setData({
        ...data,
        removeTags: data.removeTags.filter(item => item !== key),
      });
    }
  };

  const handleTagRemoval = key => {
    if (data.tags.includes(key)) {
      setData({
        ...data,
        removeTags: [...data.removeTags, key],
        addTags: data.addTags.filter(item => item !== key),
      });
    } else {
      setData({
        ...data,
        addTags: data.addTags.filter(item => item !== key),
      });
    }
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

  const addArticle = async () => {
    if (
      validateEmptyText(data.title, 'Title is not provided') &&
      validateEmptyText(
        data.description,
        'Provide details for the mentioned title'
      )
    ) {
      const outcome = await saveArticle(
        props.space,
        {
          categoryId: props.urlParam.categoryid,
          title: data.title,
          description: data.description,
          addTags: data.addTags,
          removeTags: data.removeTags,
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
        <OakButton action={() => addArticle()} theme="primary" variant="appear">
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
        <OakChipGroup
          handleAddition={handleTagAddition}
          handleRemoval={handleTagRemoval}
          // objects={globalTagsObjects}
          elements={globalTags}
          data={view}
          id="tags"
          label="Tags"
        />
      </div>
    </div>
  );
};
export default CreateItem;
