import React, { useState } from 'react';
import OakViewer from '../../../../oakui/OakViewer';
import NewCommentItem from './NewCommentItem';
import ParentCommentPreview from './ParentCommentPreview';
import './style.scss';
import { formatDateText } from '../../../Lib/DateUtils';
import { PostComment } from '../../../../types/graphql';
import FeedbackView from './FeedbackView';

interface Props {
  postId: string;
  comment: PostComment;
  parentComment: PostComment;
}
function ViewComment(props: Props) {
  const [newComment, setNewComment] = useState(false);
  return (
    <div className="view-comment">
      <div className="view-comment-header">
        <div className="view-comment-meta">
          {props.comment?.createdBy} replied on{' '}
          {formatDateText(props.comment?.createdAt)}
        </div>
        <div className="view-comment-actions">
          <div className="hyperlink-container">
            <i className="material-icons typography-6">edit</i>
            <div
              className="hyperlink"
              onClick={() => setNewComment(!newComment)}
            >
              Edit
            </div>
          </div>
          <div className="hyperlink-container">
            <i className="material-icons typography-6">reply</i>
            <div
              className="hyperlink"
              onClick={() => setNewComment(!newComment)}
            >
              Reply
            </div>
          </div>
        </div>
      </div>
      {props.parentComment && (
        <ParentCommentPreview parentComment={props.parentComment} />
      )}
      <OakViewer>{props.comment?.text}</OakViewer>
      {newComment && (
        <NewCommentItem
          postId={props.postId}
          setNewComment={setNewComment}
          parentid={props.comment.id}
        />
      )}
      <FeedbackView comment={props.comment} />
    </div>
  );
}

export default ViewComment;
