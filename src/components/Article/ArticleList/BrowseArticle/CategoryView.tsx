import React, { useEffect, useState } from 'react';
import './style.scss';
import { Category } from '../../../../types/graphql';

interface Props {
  category: Category;
  categories: Array<Category>;
  handleClick: any;
}

const CategoryView = (props: Props) => {
  const [articleCount, setArticleCount] = useState(0);
  const [subCategoryCount, setSubCategoryCount] = useState(0);

  const computeTotalArticles = () => {
    setArticleCount(addChildrenArticles(0, props.category));
    setSubCategoryCount(
      props.categories.filter(
        item => item.parentCategoryId === props.category.id
      ).length
    );
  };

  const addChildrenArticles = (count, category: Category) => {
    let newCount = count;
    newCount += category.articles;
    const children = props.categories.filter(
      item => item.parentCategoryId === category.id
    );
    if (children.length === 0) {
      return newCount;
    }

    children.forEach(item => {
      newCount += addChildrenArticles(count, item);
    });

    return newCount;
  };

  useEffect(() => {
    if (props.category && props.categories) {
      computeTotalArticles();
    }
  }, [props.categories, props.category]);
  return (
    <div className="category-view" onClick={props.handleClick}>
      <div className="typography-8">{props.category.name}</div>
      {articleCount > 0 && (
        <div className="typography-4">{`${articleCount} articles`}</div>
      )}
      {articleCount === 0 && <div className="typography-4">No articles</div>}
      {subCategoryCount > 0 && (
        <div className="typography-4">{`${subCategoryCount} sub categories`}</div>
      )}
    </div>
  );
};

export default CategoryView;
