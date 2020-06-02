import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import OakText from '../../../oakui/OakText';
import OakEditor from '../../../oakui/OakEditor';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces } from '../../Utils';
import { sendMessage } from '../../../events/MessageService';
import CategoryTree from '../../Category/CategoryTree';
import OakChipGroup from '../../../oakui/OakChipGroup';
import { ArticlePayload } from '../../../types/graphql';

interface Props {
  categoryid: any;
  history: any;
  space: any;
}

const ADD_ARTICLE = gql`
  mutation AddArticle($payload: ArticlePayload!) {
    addArticle(payload: $payload) {
      id
    }
  }
`;

const CreateItem = (props: Props) => {
  const [addArticle, { data: savedArticle }] = useMutation(ADD_ARTICLE);
  const [state, setState] = useState<any>({
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

  useEffect(() => {
    setState({
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
        tags: [...state.tags, ...state.addTags].filter(
          item => !state.removeTags.includes(item)
        ),
      }),
    [state.addTags, state.tags, state.removeTags]
  );

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleTagAddition = key => {
    if (!state.tags.includes(key)) {
      setState({
        ...state,
        addTags: [...state.addTags, key],
        removeTags: state.removeTags.filter(item => item !== key),
      });
    } else {
      setState({
        ...state,
        removeTags: state.removeTags.filter(item => item !== key),
      });
    }
  };

  const handleTagRemoval = key => {
    if (state.tags.includes(key)) {
      setState({
        ...state,
        removeTags: [...state.removeTags, key],
        addTags: state.addTags.filter(item => item !== key),
      });
    } else {
      setState({
        ...state,
        addTags: state.addTags.filter(item => item !== key),
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
      validateEmptyText(state.title, 'Title is not provided') &&
      validateEmptyText(
        state.description,
        'Provide details for the mentioned title'
      )
    ) {
      const payload: ArticlePayload = {
        title: state.title,
        categoryId: props.categoryid,
        description: state.description,
        addTags: state.addTags,
        removeTags: state.removeTags,
      };
      addArticle({
        variables: {
          payload,
        },
      }).then(response => {
        props.history.length > 2
          ? props.history.goBack()
          : props.history.push(`/${props.space}/article`);
      });
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
        {/* <CategoryTree id={props.categoryid} /> */}
        <OakText
          label="Title"
          data={state}
          id="title"
          handleChange={e => handleChange(e)}
        />
        <OakEditor
          label="Description"
          data={state}
          id="description"
          handleChange={e => handleChange(e)}
        />
        <OakChipGroup
          handleAddition={handleTagAddition}
          handleRemoval={handleTagRemoval}
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
