import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './style.scss';
import { Article, Category } from '../../../types/graphql';
import OakInfiniteScroll from '../../../oakui/OakInfiniteScroll';
import OakViewer from '../../../oakui/OakViewer';
import OakSpinner from '../../../oakui/OakSpinner';
import CategoryView from './CategoryView';

interface Props {
  categoryId: string;
  handleChange: Function;
}

const LIST_CATEGORIES = gql`
  query Categories {
    categories {
      id
      name
      parentCategoryId
    }
  }
`;

const CategorySection = (props: Props) => {
  const { loading, error, data } = useQuery(LIST_CATEGORIES);

  const [view, setView] = useState<Array<Category> | undefined>();

  useEffect(() => {
    console.log(data?.categories);
    console.log(props.categoryId);
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
      {view?.map((item: Category) => (
        <CategoryView
          category={item}
          key={item.id}
          handleClick={() => props.handleChange(item.id)}
        />
      ))}
      <div>{loading ? <OakSpinner /> : ''}</div>
    </div>
  );
};

export default CategorySection;
