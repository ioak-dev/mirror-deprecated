import React from 'react';
import './style.scss';
import { ArticleTagCloud } from '../../../../types/graphql';

interface Props {
  tag: ArticleTagCloud;
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
