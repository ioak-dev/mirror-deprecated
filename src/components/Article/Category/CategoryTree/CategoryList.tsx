import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './style.scss';
import { LIST_ARTICLE_CATEGORIES } from '../../../Types/ArticleSchema';
import { ArticleCategory } from '../../../../types/graphql';
import CategoryView from './CategoryView';

interface Props {
  category: ArticleCategory;
  handleChange: Function;
}

const CategoryList = (props: Props) => {
  const { loading, error, data } = useQuery(LIST_ARTICLE_CATEGORIES);

  const [view, setView] = useState<Array<ArticleCategory> | undefined>();

  useEffect(() => {
    if (data?.articleCategories && props.category?.id) {
      setView(
        data.articleCategories.filter(
          (item: ArticleCategory) =>
            item.parentCategoryId === props.category?.id
        )
      );
    } else if (data?.articleCategories) {
      setView(
        data.articleCategories.filter(
          (item: ArticleCategory) => !item.parentCategoryId
        )
      );
    }
  }, [props.category, data]);

  return (
    <div className="category-tree-list">
      {/* <div className="close-category-tree hyperlink-container align-horizontal">
        <i className="material-icons">close</i>
        <div className="hyperlink">Close</div>
      </div> */}
      <div className="category-list">
        <CategoryView
          category={props.category}
          key={props.category?.id}
          parentNode
          handleChange={() =>
            props.handleChange(props.category?.parentCategoryId)
          }
        />
        {view?.map((item: ArticleCategory) => (
          <CategoryView
            category={item}
            key={item.id}
            handleChange={() => props.handleChange(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
