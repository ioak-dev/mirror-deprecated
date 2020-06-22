import React, { useState } from 'react';
import { PostComment } from '../../../../types/graphql';
import OakViewer from '../../../../oakui/OakViewer';
import { formatDateText } from '../../../Lib/DateUtils';
import { htmlToText } from '../../../Utils';

interface Props {
  parentComment: PostComment;
}

const ParentCommentPreview = (props: Props) => {
  const [showFullText, setShowFullText] = useState(false);
  return (
    <div className="parent-comment-preview">
      <div className="parent-comment-preview-header">
        <div
          className="hyperlink"
          onClick={() => setShowFullText(!showFullText)}
        >
          In reply to {props.parentComment.createdBy}&apos;s post on{' '}
          {formatDateText(props.parentComment.createdAt)}
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
