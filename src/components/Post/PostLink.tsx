import React from 'react';
import './style.scss';
import { Post } from '../../types/graphql';
import { formatDateText } from '../Lib/DateUtils';

interface Props {
  post: Post;
  history: any;
  asset: string;
}

const PostLink = (props: Props) => {
  const viewPost = () => {
    props.history.push(`/${props.asset}/post/view?id=${props.post.id}`);
  };

  return (
    <div className="post-link">
      <div className="post-title typography-7">
        <div className="link hyperlink-drama" onClick={viewPost}>
          {props.post?.title}
        </div>
      </div>
      <div className="post-meta">
        <div className="answered-post">
          <i className="material-icons-outlined">verified</i>
        </div>
        {props.post?.createdAt && (
          <div className="post-date">
            Published on {formatDateText(props.post?.createdAt)}
          </div>
        )}
        {props.post?.views > 0 && (
          <div className="post-statistic-chip">
            {`${props.post?.views} ${
              props.post?.views === 1 ? 'view' : 'views'
            }`}
          </div>
        )}
        {props.post?.comments > 0 && (
          <div className="post-statistic-chip comments">
            {props.post?.comments}
            <i className="material-icons">forum</i>
          </div>
        )}
        {props.post?.helpful > 0 && (
          <div className="post-statistic-chip helpful">
            {props.post?.helpful}
            <i className="material-icons">thumb_up</i>
          </div>
        )}
        {props.post?.notHelpful > 0 && (
          <div className="post-statistic-chip not-helpful">
            {props.post?.notHelpful}
            <i className="material-icons">thumb_down</i>
          </div>
        )}
        {props.post?.followers > 0 && (
          <div className="post-statistic-chip follower">
            {props.post?.followers}
            <i className="material-icons">rss_feed</i>
          </div>
        )}
      </div>

      <div className="post-description typography-4 three-liner">
        {props.post.description}
      </div>
    </div>
  );
};

export default PostLink;
