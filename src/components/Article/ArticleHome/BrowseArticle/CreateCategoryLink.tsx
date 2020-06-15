import React from 'react';
import './style.scss';

interface Props {
  action: any;
}

const CreateCategoryLink = (props: Props) => {
  return (
    <div className="create-category-link" onClick={props.action}>
      <i className="material-icons">add_circle</i>
      <div>Category</div>
    </div>
  );
};

export default CreateCategoryLink;
