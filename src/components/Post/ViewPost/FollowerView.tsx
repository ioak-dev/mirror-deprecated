import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { Post } from '../../../types/graphql';
import { FOLLOW_POST, UNFOLLOW_POST } from '../../Types/PostSchema';
import { sendMessage } from '../../../events/MessageService';

interface Props {
  post: Post;
}
const FollowerView = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [addFollower] = useMutation(FOLLOW_POST);
  const [removeFollower] = useMutation(UNFOLLOW_POST);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(
      !!props.post.followerList?.find(item => item?.userId === authorization.id)
    );
  }, [props.post.followerList]);

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
    <div
      className="follower-view"
      onClick={() => (isFollowing ? unfollow() : follow())}
    >
      <div className={`follow-action ${isFollowing ? 'active' : ''}`}>
        <div className="followers-count">
          {/* {props.post.followers} */}
          <i className="material-icons-outlined">rss_feed</i>
        </div>
        {isFollowing && <>Stop following</>}
        {!isFollowing && <>Follow</>}
      </div>
    </div>
  );
};

export default FollowerView;
