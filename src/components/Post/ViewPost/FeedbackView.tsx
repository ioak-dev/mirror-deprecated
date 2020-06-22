import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Post } from '../../../types/graphql';
import {
  ADD_POST_FEEDBACK,
  REMOVE_POST_FEEDBACK,
  GET_POST,
} from '../../Types/PostSchema';
import { sendMessage } from '../../../events/MessageService';

interface Props {
  post: Post;
}

const FeedbackView = (props: Props) => {
  const [addPostFeedback, { data: addedFeedback }] = useMutation(
    ADD_POST_FEEDBACK
  );
  const [removePostFeedback, { data: removedFeedback }] = useMutation(
    REMOVE_POST_FEEDBACK
  );
  const [providedFeedbacks, setProvidedFeedbacks] = useState<any[]>([]);

  const feedback = type => {
    if (providedFeedbacks.includes(type)) {
      removePostFeedback({
        variables: {
          postId: props.post.id,
          type,
        },
      }).then(() => {
        sendMessage('notification', true, {
          type: 'success',
          message: 'You have withdrawn your feedback',
        });
      });
    } else {
      addPostFeedback({
        variables: {
          postId: props.post.id,
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

  useEffect(() => {
    if (props.post?.feedback) {
      setProvidedFeedbacks(props.post.feedback.map((item: any) => item.type));
    } else {
      setProvidedFeedbacks([]);
    }
  }, [props.post.feedback]);

  return (
    <div className="action-footer position-right space-top-4 post-feedback align-horizontal">
      <div className="align-horizontal">
        <i
          className={`material-icons helpful ${
            providedFeedbacks.includes('helpful') ? ' active' : ''
          }`}
          onClick={() => feedback('helpful')}
        >
          thumb_up
        </i>
        <div className="typography-5">{props.post.helpful}</div>
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
        <div className="typography-5">{props.post.notHelpful}</div>
      </div>
    </div>
  );
};

export default FeedbackView;
