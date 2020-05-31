import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import OakText from '../../../oakui/OakText';
import OakEditor from '../../../oakui/OakEditor';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces } from '../../Utils';
import { sendMessage, receiveMessage } from '../../../events/MessageService';
import { saveArticle } from '../ArticleService';
import CategoryTree from '../../Category/CategoryTree';
import OakChipGroup from '../../../oakui/OakChipGroup';
import { ArticlePayload } from '../../../types/graphql';

const domain = 'article';

interface Props {
  urlParam: any;
  history: any;
  space: any;
}

const ADD_ARTICLE = gql`
  mutation AddArticle($payload: ArticlePayload!) {
    addArticle(payload: $payload) {
      id
      title
    }
  }
`;

const CreateItem = (props: Props) => {
  const [addArticle, { data: savedArticle }] = useMutation(ADD_ARTICLE);
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

  const submit = () => {
    if (
      validateEmptyText(data.title, 'Title is not provided') &&
      validateEmptyText(
        data.description,
        'Provide details for the mentioned title'
      )
    ) {
      const payload: ArticlePayload = {
        title: data.title,
        categoryId: props.urlParam.categoryid,
        description: data.description,
        addTags: data.addTags,
        removeTags: data.removeTags,
      };
      addArticle({
        variables: {
          payload,
        },
      }).then(response => props.history.goBack());
    }
  };

  const cancelCreation = () => {
    props.history.goBack();
  };

  return (
    <div className="create-article-item">
      <div className="action-header position-right">
        <OakButton action={submit} theme="primary" variant="appear">
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
