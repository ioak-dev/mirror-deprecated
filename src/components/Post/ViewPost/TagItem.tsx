import React from 'react';

interface Props {
  name: string;
  history: any;
  asset: string;
}

const TagItem = (props: Props) => {
  const viewTag = event => {
    props.history.push(`/${props.asset}/post/tag?name=${props.name}`);
  };
  return (
    <div className="tag-item" onClick={viewTag}>
      <div className="tag-content">
        <i className="material-icons">local_offer</i>
        {props.name}
      </div>
    </div>
  );
};

export default TagItem;
