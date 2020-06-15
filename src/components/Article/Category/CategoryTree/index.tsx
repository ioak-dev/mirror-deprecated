import React, { useState, useEffect } from 'react';
import './style.scss';
import { ArticleCategory } from '../../../../types/graphql';
import CategoryList from './CategoryList';

interface Props {
  category: ArticleCategory;
  categories: Array<ArticleCategory>;
  handleChange: any;
  choosable?: boolean;
}
const CategoryTree = (props: Props) => {
  const [tree, setTree] = useState<Array<ArticleCategory | any>>();

  const [showChoose, setShowChoose] = useState(false);

  useEffect(() => {
    if (props.category && props.categories) {
      setTree([{ name: 'all' }, ...traceParents(props.category)]);
    } else {
      setTree([{ name: '...' }]);
    }
  }, [props.category, props.categories]);

  const traceParents = (category: ArticleCategory) => {
    const parentCategory = props.categories.find(
      item => item.id === category.parentCategoryId
    );

    if (parentCategory) {
      return [...traceParents(parentCategory), category];
    }
    return [category];
  };

  return (
    <div className="category-tree">
      <div className="node-structure">
        <i className="material-icons">label_important</i>
        {tree &&
          tree.map((item, index) => (
            <div key={item.id || index} className="tree-node">
              {(index === tree.length - 1 ||
                (props.choosable && !showChoose)) && (
                <div className="category-name typography-5" key={item.id}>
                  {item.name}
                </div>
              )}

              {index !== tree.length - 1 && (!props.choosable || showChoose) && (
                <div
                  className="category-name typography-5 hyperlink"
                  key={item.id}
                  onClick={() => props.handleChange(item.id)}
                >
                  {item.name}
                </div>
              )}
              {index !== tree.length - 1 && (
                <div className="category-relation">
                  <i className="material-icons">keyboard_arrow_right</i>
                </div>
              )}
            </div>
          ))}
        {props.choosable && !showChoose && (
          <div className="hyperlink-container align-horizontal action-link space-left-1">
            <i className="material-icons">edit</i>
            <div className="hyperlink" onClick={() => setShowChoose(true)}>
              Change
            </div>
          </div>
        )}
        {props.choosable && showChoose && (
          <div className="hyperlink-container align-horizontal action-link space-left-1">
            <i className="material-icons">close</i>
            <div className="hyperlink" onClick={() => setShowChoose(false)}>
              Close
            </div>
          </div>
        )}
      </div>
      <div className="choose-node-container">
        {showChoose && (
          <CategoryList
            category={props.category}
            handleChange={props.handleChange}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryTree;
