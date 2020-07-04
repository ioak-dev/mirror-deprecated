import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import OakText from '../../../oakui/OakText';
import OakEditor from '../../../oakui/OakEditor';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces } from '../../Utils';
import { sendMessage } from '../../../events/MessageService';
import { Post, PostPayload } from '../../../types/graphql';
import OakChipGroup from '../../../oakui/OakChipGroup';
import { UPDATE_POST } from '../../Types/PostSchema';
import OakHeading from '../../../oakui/OakHeading';

interface Props {
  id: string;
  history: any;
  asset: any;
  post: Post;
}

const EditItem = (props: Props) => {
  const [updatePost] = useMutation(UPDATE_POST);
  const [state, setState] = useState<any>({
    id: '',
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
    const tags: string[] = [];
    props.post.tags?.map(item => {
      tags.push(item?.name || '');
    });
    setState({
      id: props.post.id,
      title: props.post.title,
      description: props.post.description,
      tags,
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

  const update = async () => {
    if (
      validateEmptyText(state.title, 'Title is not provided') &&
      validateEmptyText(
        state.description,
        'Provide details for the mentioned title'
      )
    ) {
      const payload: PostPayload = {
        id: props.post.id,
        title: state.title,
        description: state.description,
        addTags: state.addTags,
        removeTags: state.removeTags,
      };
      updatePost({
        variables: {
          payload,
        },
      }).then(response => {
        if (props.history.length > 2) props.history.goBack();
      });
    }
  };

  const cancelCreation = () => {
    props.history.goBack();
  };

  return (
    <>
      <div className="page-header">
        <OakHeading title="Edit post" />
        <div className="action-header position-right">
          <OakButton action={update} theme="primary" variant="appear">
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
      </div>
      <div className="create-post-item">
        <div className="user-form">
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
            handleChange={handleChange}
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
    </>
  );
};
export default EditItem;
