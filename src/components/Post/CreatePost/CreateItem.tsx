import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import OakText from '../../../oakui/OakText';
import OakEditor from '../../../oakui/OakEditor';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import OakChipGroup from '../../../oakui/OakChipGroup';
import { PostPayload } from '../../../types/graphql';

interface Props {
  history: any;
  asset: any;
}

const ADD_POST = gql`
  mutation AddPost($payload: PostPayload!) {
    addPost(payload: $payload) {
      id
    }
  }
`;

const CreateItem = (props: Props) => {
  const [addPost, { data: savedPost }] = useMutation(ADD_POST);
  const [state, setState] = useState<any>({
    title: '',
    description: '',
    tags: [],
    addTags: [],
    removeTags: [],
  });
  const [formErrors, setFormErrors] = useState<any>({
    title: null,
    description: null,
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

  const submit = () => {
    const errorFields: any = { title: null, description: '' };
    if (isEmptyOrSpaces(state.title)) {
      errorFields.title = 'Title cannot be empty';
    }
    if (isEmptyOrSpaces(state.description)) {
      errorFields.description = 'Description cannot be empty';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      const payload: PostPayload = {
        title: state.title,
        description: state.description,
        addTags: state.addTags,
        removeTags: state.removeTags,
      };
      addPost({
        variables: {
          payload,
        },
      }).then(response => {
        props.history.length > 2
          ? props.history.goBack()
          : props.history.push(`/${props.asset}/post`);
      });
    }
  };

  const cancelCreation = () => {
    props.history.goBack();
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          Create post
          {/* <div className="page-subtitle">sub text</div> */}
          <div className="page-highlight" />
        </div>
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
      </div>
      <div className="create-post-item">
        <div className="user-form">
          <OakText
            label="Title"
            data={state}
            errorData={formErrors}
            id="title"
            handleChange={e => handleChange(e)}
          />
          <OakEditor
            label="Description"
            data={state}
            errorData={formErrors}
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
    </>
  );
};
export default CreateItem;
