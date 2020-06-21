import React, { useState } from 'react';
import { formatDateText } from '../../Lib/DateUtils';
import OakViewer from '../../../oakui/OakViewer';
import OakButton from '../../../oakui/OakButton';
import Reply from '../Reply';

interface Props {
  comment: any;
  postId: string;
  commentId: string;
}

const ViewDetails = (props: Props) => {
  const [isReply, setIsReply] = useState(false);

  return (
    <>
      <div className="view-comment-item">
        <div className="app-text">
          {/* <div className="post-meta">
            {props.comment?.createdAt && (
              <div className="post-date">
                Published on {formatDateText(props.comment?.createdAt)}
              </div>
            )}
            {props.comment?.views > 0 && (
              <div className="post-statistic-chip">
                {`${props.comment?.views} ${
                  props.comment?.views === 1 ? 'view' : 'views'
                }`}
              </div>
            )}
            {props.comment?.helpful > 0 && (
              <div className="post-statistic-chip helpful">
                {props.comment?.helpful}
                <i className="material-icons">thumb_up</i>
              </div>
            )}
            {props.comment?.notHelpful > 0 && (
              <div className="post-statistic-chip not-helpful">
                {props.comment?.notHelpful}
                <i className="material-icons">thumb_down</i>
              </div>
            )}
          </div> */}

          <OakViewer>{props.comment}</OakViewer>
          <div className="action-footer position-right align-horizontal post-feedback">
            <OakButton
              action={() => setIsReply(!isReply)}
              theme="primary"
              variant="appear"
            >
              <i className="material-icons">reply</i>
            </OakButton>
          </div>
        </div>
        {isReply && (
          <Reply
            postId={props.postId}
            commentId={props.commentId}
            reply="new"
            setIsReplay={setIsReply}
          />
        )}
      </div>
    </>
  );
};

export default ViewDetails;
