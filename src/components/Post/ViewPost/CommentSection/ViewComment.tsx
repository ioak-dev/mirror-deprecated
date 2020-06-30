import React, { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import OakViewer from '../../../../oakui/OakViewer';
import NewCommentItem from './NewCommentItem';
import ParentCommentPreview from './ParentCommentPreview';
import './style.scss';
import { formatDateText } from '../../../Lib/DateUtils';
import { PostComment } from '../../../../types/graphql';
import FeedbackView from './FeedbackView';
import EditCommentItem from './EditCommentItem';
import { POST_COMMENT } from '../../../Types/PostSchema';

interface Props {
  postId: string;
  comment: PostComment;
  comments?: PostComment[];
}
function ViewComment(props: Props) {
  const gqlClient = useApolloClient();
  const [actionType, setActionType] = useState('none');
  const [parentComment, setParentComment] = useState<PostComment | undefined>();

  useEffect(() => {
    (async function anonymous() {
      const matchingComment = props.comments?.find(
        item => item.id === props.comment.parentId
      );
      setParentComment(matchingComment);
      if (!matchingComment) {
        const { data: response } = await gqlClient.query({
          query: POST_COMMENT,
          variables: { id: props.comment.parentId },
        });
        setParentComment(response?.postComment);
      }
    })();
  }, [props.comment]);

  return (
    <div className={`view-comment ${props.comment.isAnswer ? 'answer' : ''}`}>
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
          {parentComment && (
            <ParentCommentPreview parentComment={parentComment} />
          )}
          <OakViewer>{props.comment?.text}</OakViewer>
          {actionType === 'none' && (
            <div className="action-footer position-between space-top-4">
              <FeedbackView comment={props.comment} />
              {props.comment.isAnswer && (
                <div className="align-horizontal accepted-answer-container">
                  <div className="accepted-answer-label typography-4">
                    Accepted answer
                  </div>
                  <i className="answered-answer-icon material-icons-outlined">
                    verified
                  </i>
                </div>
              )}
            </div>
          )}
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
