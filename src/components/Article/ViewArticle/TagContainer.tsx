import React, { useState, useEffect } from 'react';
import Maybe from 'graphql/tsutils/Maybe';
import { Tag } from '../../../types/graphql';
import TagItem from './TagItem';

interface Props {
  tags: Array<Maybe<Tag>>;
}

const TagContainer = (props: Props) => {
  return (
    <div className="tag-container">
      {props.tags.map((item: Maybe<Tag>) => (
        <>{item && <TagItem name={item.name || ''} key={item.id || ''} />}</>
      ))}
    </div>
  );
};

export default TagContainer;
