import React from 'react';
import OakButton from '../../../oakui/OakButton';

export default function ArticleItem() {
  return (
    <div className="article-action">
      <OakButton
        action="To be completed"
        theme="primary"
        variant="disappear"
        align="center"
      >
        <i className="material-icons">double_arrow</i>Edit
      </OakButton>
      <OakButton
        action="To be completed"
        theme="primary"
        variant="disappear"
        align="center"
      >
        <i className="material-icons">double_arrow</i>Delete
      </OakButton>
      <OakButton
        action="To be completed"
        theme="primary"
        variant="disappear"
        align="center"
      >
        <i className="material-icons">double_arrow</i>Back
      </OakButton>
    </div>
  );
}
