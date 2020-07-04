import React from 'react';
import './style.scss';
import { PostTagCloud } from '../../../../types/graphql';

interface Props {
  tag: PostTagCloud;
  handleClick: any;
}

const TagLink = (props: Props) => {
  return (
    <div className="tag-link">
      <div className="hyperlink-drama" onClick={props.handleClick}>
        {props.tag.name}{' '}
      </div>
      <div>{`\u00A0(${props.tag.count})`}</div>
    </div>
  );
};

export default TagLink;
