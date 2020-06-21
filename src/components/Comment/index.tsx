import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import CreateComment from './CreateComment';
import OakButton from '../../oakui/OakButton';
import ViewComment from './ViewComment';
import { POST_COMMENTS } from '../Types/PostSchema';

interface Props {
  postId: string;
  commentId?: string;
  isReply?: boolean;
}

const CommentHome = (props: Props) => {
  const { loading, data, fetchMore } = useQuery(POST_COMMENTS, {
    variables: {
      postId: props.postId,
    },
    fetchPolicy: 'cache-and-network',
  });
  const [isComment, setIsComment] = useState(false);
  const [viewComments, setViewComments] = useState(false);
  return (
    <>
      <div className="action-footer position-left align-horizontal post-feedback">
        <OakButton
          action={() => setIsComment(!isComment)}
          theme="primary"
          variant="appear"
        >
          <i className="material-icons">reply</i>
        </OakButton>
        {!loading && (
          <OakButton
            action={() => setViewComments(!viewComments)}
            theme="primary"
            variant="appear"
          >
            <i className="material-icons">question_answer</i>
            {data?.postComments?.results?.length}
          </OakButton>
        )}
      </div>

      {isComment && (
        <CreateComment postId={props.postId} setComment={setIsComment} />
      )}
      {viewComments && <ViewComment postId={props.postId} />}
    </>
  );
};

export default CommentHome;
