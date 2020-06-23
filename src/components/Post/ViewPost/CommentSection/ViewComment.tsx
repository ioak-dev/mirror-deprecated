import React, { useState, useEffect } from 'react';
import OakViewer from '../../../../oakui/OakViewer';
import NewCommentItem from './NewCommentItem';
import ParentCommentPreview from './ParentCommentPreview';
import './style.scss';
import { formatDateText } from '../../../Lib/DateUtils';
import { PostComment } from '../../../../types/graphql';
import FeedbackView from './FeedbackView';
import EditCommentItem from './EditCommentItem';

interface Props {
  postId: string;
  comment: PostComment;
  parentComment: PostComment;
}
function ViewComment(props: Props) {
  const [newComment, setNewComment] = useState(false);
  const [editComment, setEditComment] = useState(false);

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
              onClick={() => setEditComment(!editComment)}
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

      {!editComment && props.parentComment && (
        <ParentCommentPreview parentComment={props.parentComment} />
      )}
      {!editComment && <OakViewer>{props.comment?.text}</OakViewer>}
      {newComment && (
        <NewCommentItem
          postId={props.postId}
          setNewComment={setNewComment}
          parentid={props.comment.id}
        />
      )}
      {editComment && (
        <EditCommentItem
          postId={props.postId}
          setEditComment={setEditComment}
          comment={props.comment}
        />
      )}
      <FeedbackView comment={props.comment} />
    </div>
  );
}

export default ViewComment;
