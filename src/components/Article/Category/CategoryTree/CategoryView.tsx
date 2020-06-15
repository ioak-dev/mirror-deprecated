import React from 'react';
import './style.scss';
import { ArticleCategory } from '../../../../types/graphql';

interface Props {
  category: ArticleCategory;
  handleChange?: any;
  parentNode?: boolean;
}

const CategoryView = (props: Props) => {
  return (
    <>
      {!props.parentNode && props.category && (
        <div className="category-tree-link-child" onClick={props.handleChange}>
          <div className="typography-5">{props.category.name}</div>
        </div>
      )}
      {props.parentNode && props.category && (
        <div className="category-tree-link-parent">
          <div className="typography-5 align-horizontal">
            {props.category.name}
            <div className="typography-4 space-left-2 current-node-label">
              chosen
            </div>
          </div>
          <i className="material-icons" onClick={props.handleChange}>
            call_made
          </i>
        </div>
      )}
    </>
  );
};

export default CategoryView;
