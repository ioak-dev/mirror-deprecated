import React, { useState, useEffect } from 'react';
import { PostComment, User } from '../../../../types/graphql';
import OakViewer from '../../../../oakui/OakViewer';
import { formatDateText } from '../../../Lib/DateUtils';
import { htmlToText } from '../../../Utils';
import OakAvatar from '../../../../oakui/OakAvatar';

interface Props {
  parentComment: PostComment;
  users: User[];
}

const ParentCommentPreview = (props: Props) => {
  const [showFullText, setShowFullText] = useState(false);
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    setUser(
      props.users?.find(item => item.id === props.parentComment?.createdBy)
    );
  }, [props.parentComment]);

  return (
    <div className="parent-comment-preview">
      <div className="parent-comment-preview-header">
        <div
          className="hyperlink align-horizontal"
          onClick={() => setShowFullText(!showFullText)}
        >
          In reply to {`${user?.firstName} ${user?.lastName}`}
          &apos;s post on {formatDateText(props.parentComment.createdAt)}
        </div>
        {!showFullText && (
          <div className="one-liner">
            {htmlToText(props.parentComment.text)}
          </div>
        )}
      </div>
      {showFullText && (
        <div className="parent-comment-preview-content">
          <OakViewer>{props.parentComment.text}</OakViewer>
        </div>
      )}
    </div>
  );
};

export default ParentCommentPreview;
