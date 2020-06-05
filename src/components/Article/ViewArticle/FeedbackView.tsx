import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Article, Feedback } from '../../../types/graphql';
import { ADD_FEEDBACK, REMOVE_FEEDBACK, GET_ARTICLE } from '../../Types/schema';
import { sendMessage } from '../../../events/MessageService';

interface Props {
  article: Article;
}

const FeedbackView = (props: Props) => {
  const [addFeedback, { data: addedFeedback }] = useMutation(ADD_FEEDBACK);
  const [removeFeedback, { data: removedFeedback }] = useMutation(
    REMOVE_FEEDBACK
  );
  const [providedFeedbacks, setProvidedFeedbacks] = useState<any[]>([]);

  const feedback = type => {
    if (providedFeedbacks.includes(type)) {
      removeFeedback({
        variables: {
          articleId: props.article.id,
          type,
        },
      }).then(() => {
        sendMessage('notification', true, {
          type: 'success',
          message: 'You have withdrawn your feedback',
        });
      });
    } else {
      addFeedback({
        variables: {
          articleId: props.article.id,
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
    if (props.article?.feedback) {
      setProvidedFeedbacks(
        props.article.feedback.map((item: any) => item.type)
      );
    } else {
      setProvidedFeedbacks([]);
    }
  }, [props.article.feedback]);

  return (
    <div className="action-footer position-right space-top-4 article-feedback">
      <i
        className={`material-icons helpful ${
          providedFeedbacks.includes('helpful') ? ' active' : ''
        }`}
        onClick={() => feedback('helpful')}
      >
        thumb_up
      </i>
      <i
        className={`material-icons not-helpful ${
          providedFeedbacks.includes('notHelpful') ? ' active' : ''
        }`}
        onClick={() => feedback('notHelpful')}
      >
        thumb_down
      </i>
    </div>
  );
};

export default FeedbackView;
