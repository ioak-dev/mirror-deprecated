import React from 'react';
import './style.scss';

interface Props {
  id: any;
}
const CategoryTree = (props: Props) => {
  return <div className="category-tree">{props.id}</div>;
};

export default CategoryTree;
