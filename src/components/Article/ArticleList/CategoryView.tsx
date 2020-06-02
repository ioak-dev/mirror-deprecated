import React from 'react';
import './style.scss';
import { Category } from '../../../types/graphql';

interface Props {
  category: Category;
  handleClick: any;
}

const CategoryView = (props: Props) => {
  return (
    <div className="category-view" onClick={props.handleClick}>
      <div className="typography-8">{props.category.name}</div>
    </div>
  );
};

export default CategoryView;
