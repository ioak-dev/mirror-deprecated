import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import OakEditor from '../../../../oakui/OakEditor';
import OakButton from '../../../../oakui/OakButton';
import { UPDATE_POST_COMMENT } from '../../../Types/PostSchema';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../../Utils';
import { PostCommentPayload } from '../../../../types/graphql';

interface Props {
  postId: string;
  parentid?: string;
  closeEdit: Function;
}

const NewCommentItem = (props: Props) => {
  const [createComment] = useMutation(UPDATE_POST_COMMENT);
  const [state, setState] = useState({ comment: '' });
  const [formErrors, setFormErrors] = useState<any>({
    comment: '',
  });

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const submit = () => {
    const errorFields: any = { comment: '' };
    if (isEmptyOrSpaces(state.comment)) {
      errorFields.comment = 'Add comment to reply';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      const payload: PostCommentPayload = {
        parentId: props.parentid,
        postId: props.postId,
        text: state.comment,
      };
      createComment({
        variables: {
          payload,
        },
      }).then(response => {
        if (response.data.updatePostComment.id) {
          props.closeEdit();
        }
      });
    }
  };

  return (
    <>
      <OakEditor
        data={state}
        errorData={formErrors}
        id="comment"
        handleChange={e => handleChange(e)}
      />
      <div className="action-header position-right">
        <OakButton
          action={() => props.closeEdit()}
          theme="default"
          variant="appear"
        >
          <i className="material-icons">close</i>Cancel
        </OakButton>
        <OakButton action={submit} theme="primary" variant="appear">
          <i className="material-icons">double_arrow</i>Save
        </OakButton>
      </div>
    </>
  );
};

export default NewCommentItem;
