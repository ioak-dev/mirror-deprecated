import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Post } from '../../../types/graphql';
import { FOLLOW_POST, UNFOLLOW_POST } from '../../Types/PostSchema';
import { sendMessage } from '../../../events/MessageService';

interface Props {
  post: Post;
}
const ViewFollowers = (props: Props) => {
  const [addFollower] = useMutation(FOLLOW_POST);
  const [removeFollower] = useMutation(UNFOLLOW_POST);

  const follow = () => {
    addFollower({
      variables: {
        postId: props.post.id,
      },
    }).then(() => {
      sendMessage('notification', true, {
        type: 'success',
        message: 'You are now following the post',
      });
    });
  };

  const unfollow = () => {
    removeFollower({
      variables: {
        postId: props.post.id,
      },
    }).then(() => {
      sendMessage('notification', true, {
        type: 'success',
        message: 'You are no more following the post',
      });
    });
  };

  return (
    <div className="follower-container">
      {props.post.followerList?.length ? (
        <div className="hyperlink" onClick={unfollow}>
          Stop following
        </div>
      ) : (
        <div className="hyperlink" onClick={follow}>
          Follow
        </div>
      )}
    </div>
  );
};

export default ViewFollowers;
