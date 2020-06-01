import React from 'react';
import './style.scss';

interface Props {
  id: any;
  pageid?: string;
}
const CategoryTree = (props: Props) => {
  return (
    <div className="category-tree">
      <div className="category-name typography-4">lorem ipsum</div>
      <div className="category-relation">
        <i className="material-icons">keyboard_arrow_right</i>
      </div>
      <div className="category-name typography-4">dolor sit</div>
      {props.pageid !== 'leafNode' && (
        <div className="action typography-4">change</div>
      )}
    </div>
  );
};

export default CategoryTree;
