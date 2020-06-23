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
  const [actionType, setActionType] = useState('none');

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
              onClick={() => setActionType('editcomment')}
            >
              Edit
            </div>
          </div>
          <div className="hyperlink-container">
            <i className="material-icons typography-6">reply</i>
            <div className="hyperlink" onClick={() => setActionType('reply')}>
              Reply
            </div>
          </div>
        </div>
      </div>

      {['none', 'reply'].includes(actionType) && (
        <>
          {props.parentComment && (
            <ParentCommentPreview parentComment={props.parentComment} />
          )}
          <OakViewer>{props.comment?.text}</OakViewer>
          {actionType === 'none' && <FeedbackView comment={props.comment} />}
        </>
      )}
      {actionType === 'reply' && (
        <NewCommentItem
          postId={props.postId}
          closeEdit={() => setActionType('none')}
          parentid={props.comment.id}
        />
      )}
      {actionType === 'editcomment' && (
        <EditCommentItem
          postId={props.postId}
          closeEdit={() => setActionType('none')}
          comment={props.comment}
        />
      )}
    </div>
  );
}

export default ViewComment;
