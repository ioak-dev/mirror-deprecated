import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { PostComment, PostCommentPayload } from '../../../../types/graphql';
import OakEditor from '../../../../oakui/OakEditor';
import OakButton from '../../../../oakui/OakButton';
import { UPDATE_POST_COMMENT } from '../../../Types/PostSchema';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../../Utils';

interface Props {
  postId: string;
  comment: PostComment;
  setEditComment: Function;
}
const EditCommentItem = (props: Props) => {
  const [updateComment] = useMutation(UPDATE_POST_COMMENT);
  const [state, setState] = useState<any>({ comment: '' });
  const [formErrors, setFormErrors] = useState<any>({
    comment: '',
  });

  useEffect(() => {
    setState({ comment: props.comment?.text });
  }, [props.comment]);

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
        id: props.comment.id,
        parentId: props.comment.parentId,
        postId: props.postId,
        text: state.comment,
      };
      updateComment({
        variables: {
          payload,
        },
      }).then(response => {
        if (response.data.updatePostComment.id) {
          props.setEditComment(false);
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
        <OakButton action={submit} theme="primary" variant="appear">
          <i className="material-icons">double_arrow</i>Save
        </OakButton>
      </div>
    </>
  );
};

export default EditCommentItem;
