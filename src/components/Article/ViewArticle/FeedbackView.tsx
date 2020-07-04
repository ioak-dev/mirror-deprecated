import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Article } from '../../../types/graphql';
import {
  ADD_ARTICLE_FEEDBACK,
  REMOVE_ARTICLE_FEEDBACK,
  GET_ARTICLE,
} from '../../Types/ArticleSchema';
import { sendMessage } from '../../../events/MessageService';

interface Props {
  article: Article;
}

const FeedbackView = (props: Props) => {
  const [addArticleFeedback, { data: addedFeedback }] = useMutation(
    ADD_ARTICLE_FEEDBACK
  );
  const [removeArticleFeedback, { data: removedFeedback }] = useMutation(
    REMOVE_ARTICLE_FEEDBACK
  );
  const [providedFeedbacks, setProvidedFeedbacks] = useState<any[]>([]);

  const feedback = type => {
    if (providedFeedbacks.includes(type)) {
      removeArticleFeedback({
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
      addArticleFeedback({
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
        <div className="typography-5">{props.article.helpful}</div>
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
        <div className="typography-5">{props.article.notHelpful}</div>
      </div>
    </div>
  );
};

export default FeedbackView;
