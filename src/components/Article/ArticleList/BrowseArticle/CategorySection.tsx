import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './style.scss';
import { Article, Category } from '../../../../types/graphql';
import CategoryView from './CategoryView';
import CategoryTree from '../../../Category/CategoryTree';
import OakSpinner from '../../../../oakui/OakSpinner';
import CreateCategory from './CreateCategory';
import CreateCategoryLink from './CreateCategoryLink';
import OakButton from '../../../../oakui/OakButton';
import { LIST_CATEGORIES } from '../../../Types/schema';

interface Props {
  categoryId: string;
  handleChange: Function;
  space: string;
  history: any;
}

const CategorySection = (props: Props) => {
  const { loading, error, data } = useQuery(LIST_CATEGORIES);

  const [view, setView] = useState<Array<Category> | undefined>();

  const [showNewCategoryPrompt, setShowNewCategoryPrompt] = useState(false);

  useEffect(() => {
    if (data?.categories && props.categoryId) {
      setView(
        data.categories.filter(
          (item: Category) => item.parentCategoryId === props.categoryId
        )
      );
    } else if (data?.categories) {
      setView(
        data.categories.filter((item: Category) => !item.parentCategoryId)
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
                category={data?.categories?.find(
                  (item: Category) => item.id === props.categoryId
                )}
                categories={data?.categories}
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
        {view?.map((item: Category) => (
          <CategoryView
            category={item}
            categories={data?.categories}
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
