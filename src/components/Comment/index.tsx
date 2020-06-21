import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import CreateComment from './CreateComment';
import OakButton from '../../oakui/OakButton';
import ViewComment from './ViewComment';
import './style.scss';
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
  const [viewComments, setViewComments] = useState(true);
  return (
    <>
      <div className="section-header">
        <div className="section-title">
          Comments&nbsp;({data?.postComments?.results?.length})
          <div className="section-subtitle">
            <div className="typography-5 comment-section-subtitle align-horizontal">
              <div className="comment-section-actions">
                <div className="align-horizontal hyperlink-container">
                  <i className="material-icons typography-6">edit</i>
                  <div
                    className="hyperlink"
                    onClick={() => setIsComment(!isComment)}
                  >
                    New comment
                  </div>
                </div>
                <div className="align-horizontal hyperlink-container">
                  <i className="material-icons typography-6">
                    {viewComments ? 'expand_less' : 'expand_more'}
                  </i>
                  <div
                    className="hyperlink"
                    onClick={() => setViewComments(!viewComments)}
                  >
                    {viewComments ? 'Hide' : 'Show'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section-highlight" />
        </div>
      </div>

      {isComment && (
        <CreateComment postId={props.postId} setComment={setIsComment} />
      )}
      <div className={viewComments ? 'view-comment show' : 'view-comment hide'}>
        <ViewComment postId={props.postId} />
      </div>
    </>
  );
};

export default CommentHome;
