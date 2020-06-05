import React from 'react';
import './style.scss';
import { Category } from '../../../../types/graphql';

interface Props {
  category: Category;
  categories: Array<Category>;
  handleClick: any;
}

const CategoryView = (props: Props) => {
  return (
    <div className="category-view" onClick={props.handleClick}>
      <div className="typography-8">{props.category.name}</div>
      <div className="typography-4">
        {props.categories?.filter(
          item => item.parentCategoryId === props.category.id
        )?.length || 'no'}{' '}
        sub categories
      </div>
    </div>
  );
};

export default CategoryView;
