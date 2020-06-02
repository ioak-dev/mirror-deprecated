import React, { useState, useEffect } from 'react';
import './style.scss';
import { Category } from '../../../types/graphql';

interface Props {
  category: Category;
  categories: Array<Category>;
  handleChange: any;
}
const CategoryTree = (props: Props) => {
  const [parentCategory, setParentCategory] = useState<Category | undefined>();

  useEffect(() => {
    if (props.category && props.categories) {
      setParentCategory(
        props.categories.find(
          item => item.id === props.category.parentCategoryId
        )
      );
    }
  }, [props.category, props.categories]);

  return (
    <div className="category-tree">
      {/* <div className="category-name typography-4">lorem ipsum</div>
      <div className="category-relation">
        <i className="material-icons">keyboard_arrow_right</i>
      </div>
      <div className="category-name typography-4">dolor sit</div> */}
      {/* {props.pageid !== 'leafNode' && (
        <div className="action typography-4">change</div>
      )} */}
      {parentCategory && (
        <>
          <CategoryTree
            category={parentCategory}
            categories={props.categories}
            handleChange={props.handleChange}
          />

          <div className="category-relation">
            <i className="material-icons">keyboard_arrow_right</i>
          </div>
        </>
      )}
      {props.category && (
        <div
          className="category-name typography-4"
          onClick={() => props.handleChange(props.category.id)}
        >
          {props.category.name}
        </div>
      )}
    </div>
  );
};

export default CategoryTree;
