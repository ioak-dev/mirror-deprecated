import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './style.scss';
import { LIST_CATEGORIES } from '../../Types/schema';
import { Category } from '../../../types/graphql';
import CategoryView from './CategoryView';

interface Props {
  category: Category;
  handleChange: Function;
}

const CategoryList = (props: Props) => {
  const { loading, error, data } = useQuery(LIST_CATEGORIES);

  const [view, setView] = useState<Array<Category> | undefined>();

  useEffect(() => {
    if (data?.categories && props.category?.id) {
      setView(
        data.categories.filter(
          (item: Category) => item.parentCategoryId === props.category?.id
        )
      );
    } else if (data?.categories) {
      setView(
        data.categories.filter((item: Category) => !item.parentCategoryId)
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
        {view?.map((item: Category) => (
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
