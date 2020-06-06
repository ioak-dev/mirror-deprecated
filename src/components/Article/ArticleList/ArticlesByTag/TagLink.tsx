import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import './style.scss';
import { TAG_CLOUD } from '../../../Types/schema';
import { TagCloud } from '../../../../types/graphql';

interface Props {
  tag: TagCloud;
  handleClick: any;
}

const TagLink = (props: Props) => {
  const { loading, error, data, fetchMore, refetch } = useQuery(TAG_CLOUD);

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
