import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { Post } from '../../../types/graphql';
import { FOLLOW_POST, UNFOLLOW_POST } from '../../Types/PostSchema';
import { sendMessage } from '../../../events/MessageService';
import StatusChip from '../../Common/StatusChip';
import { days, formatDateText } from '../../Lib/DateUtils';

interface Props {
  post: Post;
}
const StatusView = (props: Props) => {
  return (
    <div className="post-status-view">
      {props.post.isAnswered && (
        <div className="post-status">
          <StatusChip label="Closed" color="success" icon="check_circle" />
          <div className="typography-4 post-status-label desktop-only">
            {`Answered on ${formatDateText(props.post.answeredOn)}`}
          </div>
        </div>
      )}
      {!props.post.isAnswered && (
        <div className="post-status">
          <StatusChip label="Open" color="failure" icon="help" />
          <div className="typography-4 post-status-label desktop-only">
            {`Asked ${Math.round(
              Math.abs(days(props.post.createdAt))
            )} days ago`}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusView;
