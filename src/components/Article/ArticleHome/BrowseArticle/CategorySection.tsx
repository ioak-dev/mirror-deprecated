import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './style.scss';
import { Article, ArticleCategory } from '../../../../types/graphql';
import CategoryView from './CategoryView';
import CategoryTree from '../../Category/CategoryTree';
import OakSpinner from '../../../../oakui/OakSpinner';
import CreateCategory from './CreateCategory';
import CreateCategoryLink from './CreateCategoryLink';
import OakButton from '../../../../oakui/OakButton';
import { LIST_ARTICLE_CATEGORIES } from '../../../Types/schema';

interface Props {
  categoryId: string;
  handleChange: Function;
  asset: string;
  history: any;
}

const CategorySection = (props: Props) => {
  const { loading, error, data } = useQuery(LIST_ARTICLE_CATEGORIES);

  const [view, setView] = useState<Array<ArticleCategory> | undefined>();

  const [showNewCategoryPrompt, setShowNewCategoryPrompt] = useState(false);

  useEffect(() => {
    if (data?.articleCategories && props.categoryId) {
      setView(
        data.articleCategories.filter(
          (item: ArticleCategory) => item.parentCategoryId === props.categoryId
        )
      );
    } else if (data?.articleCategories) {
      setView(
        data.articleCategories.filter(
          (item: ArticleCategory) => !item.parentCategoryId
        )
      );
    }
  }, [props.categoryId, data]);

  return (
    <div className="category-section">
      <div className="category-section-header">
        <div className="section-title">
          Category
          <div className="section-subtitle">
            <div className="category-subtitle">
              <CategoryTree
                category={data?.articleCategories?.find(
                  (item: ArticleCategory) => item.id === props.categoryId
                )}
                categories={data?.articleCategories}
                handleChange={props.handleChange}
              />
            </div>
          </div>
          <div className="section-highlight" />
        </div>
      </div>
      {view && view.length > 0 && (
        <div className="typography-4">Choose a category to explore</div>
      )}
      <div className="category-list">
        {view?.map((item: ArticleCategory) => (
          <CategoryView
            category={item}
            categories={data?.articleCategories}
            key={item.id}
            handleClick={() => props.handleChange(item.id)}
          />
        ))}
        {!showNewCategoryPrompt && (
          <CreateCategoryLink action={() => setShowNewCategoryPrompt(true)} />
        )}
        {showNewCategoryPrompt && (
          <CreateCategory
            parentCategoryId={props.categoryId}
            handleClose={() => setShowNewCategoryPrompt(false)}
          />
        )}
      </div>
      {props.categoryId && <div className="section-close" />}
      <div>{loading ? <OakSpinner /> : ''}</div>
    </div>
  );
};

export default CategorySection;
