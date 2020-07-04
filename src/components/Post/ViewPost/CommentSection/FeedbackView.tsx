import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { PostComment } from '../../../../types/graphql';
import {
  ADD_POST_FEEDBACK,
  REMOVE_POST_FEEDBACK,
  GET_POST,
  ADD_POST_COMMENT_FEEDBACK,
  REMOVE_POST_COMMENT_FEEDBACK,
} from '../../../Types/PostSchema';
import { sendMessage } from '../../../../events/MessageService';

interface Props {
  comment: PostComment;
}

const FeedbackView = (props: Props) => {
  const [addPostCommentFeedback, { data: addedCommentFeedback }] = useMutation(
    ADD_POST_COMMENT_FEEDBACK
  );
  const [
    removePostCommentFeedback,
    { data: removedCommentFeedback },
  ] = useMutation(REMOVE_POST_COMMENT_FEEDBACK);
  const [providedFeedbacks, setProvidedFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    if (props.comment?.feedback) {
      setProvidedFeedbacks(
        props.comment.feedback.map((item: any) => item.type)
      );
    } else {
      setProvidedFeedbacks([]);
    }
  }, [props.comment.feedback]);

  const feedback = type => {
    if (providedFeedbacks.includes(type)) {
      removePostCommentFeedback({
        variables: {
          commentId: props.comment.id,
          type,
        },
      }).then(() => {
        sendMessage('notification', true, {
          type: 'success',
          message: 'You have withdrawn your feedback',
        });
      });
    } else {
      addPostCommentFeedback({
        variables: {
          commentId: props.comment.id,
          type,
        },
      }).then(() => {
        sendMessage('notification', true, {
          type: 'success',
          message: 'Thank you for sharing your feedback',
        });
      });
    }
  };

  // useEffect(() => {
  //   if (props.comment?.feedback) {
  //     setProvidedFeedbacks(
  //       props.comment.feedback.map((item: any) => item.type)
  //     );
  //   } else {
  //     setProvidedFeedbacks([]);
  //   }
  // }, [props.comment.feedback]);

  return (
    <div className="action-footer position-left comment-feedback align-horizontal">
      <div className="align-horizontal">
        <i
          className={`material-icons helpful ${
            providedFeedbacks.includes('helpful') ? ' active' : ''
          }`}
          onClick={() => feedback('helpful')}
        >
          thumb_up
        </i>
        <div className="typography-5">{props.comment.helpful}</div>
      </div>
      <div className="align-horizontal">
        <i
          className={`material-icons not-helpful ${
            providedFeedbacks.includes('notHelpful') ? ' active' : ''
          }`}
          onClick={() => feedback('notHelpful')}
        >
          thumb_down
        </i>
        <div className="typography-5">{props.comment.notHelpful}</div>
      </div>
    </div>
  );
};

export default FeedbackView;
