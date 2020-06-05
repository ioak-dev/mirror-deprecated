import React, { useState, useEffect } from 'react';

interface Props {
  name: string;
}

const TagItem = (props: Props) => {
  return (
    <div className="tag-item">
      <div className="tag-content">
        <i className="material-icons">local_offer</i>
        {props.name}
      </div>
    </div>
  );
};

export default TagItem;
