import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import NewCommentItem from './NewCommentItem';
import CommentItem from './CommentItem';
import { POST_COMMENTS } from '../../../Types/PostSchema';
import './style.scss';

interface Props {
  postId: string;
}

const CommentSection = (props: Props) => {
  const { loading, data, fetchMore } = useQuery(POST_COMMENTS, {
    variables: {
      postId: props.postId,
    },
    fetchPolicy: 'network-only',
  });
  const [newComment, setNewComment] = useState(false);
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
                    onClick={() => setNewComment(!newComment)}
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

      {newComment && (
        <NewCommentItem postId={props.postId} setNewComment={setNewComment} />
      )}
      <div className={viewComments ? 'view-comment show' : 'view-comment hide'}>
        <CommentItem postId={props.postId} />
      </div>
    </>
  );
};

export default CommentSection;
