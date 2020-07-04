import React from 'react';
import Maybe from 'graphql/tsutils/Maybe';
import { PostTag } from '../../../types/graphql';
import TagItem from './TagItem';

interface Props {
  tags: Array<Maybe<PostTag>>;
  history: any;
  asset: string;
}

const TagContainer = (props: Props) => {
  return (
    <div className="tag-container">
      {props.tags.map((item: Maybe<PostTag>) => (
        <div key={item?.id}>
          {item && (
            <TagItem
              name={item.name || ''}
              history={props.history}
              asset={props.asset}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TagContainer;
