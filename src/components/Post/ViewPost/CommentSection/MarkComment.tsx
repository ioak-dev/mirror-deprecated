import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  MARK_POSTCOMMENT_AS_ANSWER,
  UNMARK_POSTCOMMENT_AS_ANSWER,
} from '../../../Types/PostSchema';
import { sendMessage } from '../../../../events/MessageService';
import { PostComment } from '../../../../types/graphql';

interface Props {
  comment: PostComment;
}

const MarkComment = (props: Props) => {
  const [markAnswer] = useMutation(MARK_POSTCOMMENT_AS_ANSWER);
  const [unMarkAnswer] = useMutation(UNMARK_POSTCOMMENT_AS_ANSWER);
  const [isAnswer, setIsAnswer] = useState(false);

  useEffect(() => {
    setIsAnswer(!!props.comment.isAnswer);
  }, [props.comment.isAnswer]);

  const answer = () => {
    markAnswer({
      variables: {
        id: props.comment.id,
        isAnswer,
      },
    }).then(() => {
      sendMessage('notification', true, {
        type: 'success',
        message: 'You marked a comment as answer',
      });
    });
  };

  const removeAnswer = () => {
    unMarkAnswer({
      variables: {
        id: props.comment.id,
        isAnswer,
      },
    }).then(() => {
      sendMessage('notification', true, {
        type: 'success',
        message: 'You removed a comment as answer',
      });
    });
  };
  return (
    <div
      className="mark-comment"
      onClick={() => (isAnswer ? removeAnswer() : answer())}
    >
      <div className={`mark-action ${isAnswer ? 'active' : ''}`}>
        <div className="followers-count">
          <i className="material-icons-outlined">check</i>
        </div>
        {isAnswer && <>Remove Answer</>}
        {!isAnswer && <>Mark Answer</>}
      </div>
    </div>
  );
};

export default MarkComment;
