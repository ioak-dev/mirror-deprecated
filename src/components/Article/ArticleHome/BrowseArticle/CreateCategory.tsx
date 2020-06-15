import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import './style.scss';
import OakText from '../../../../oakui/OakText';
import OakButton from '../../../../oakui/OakButton';
import {
  UPDATE_CATEGORY,
  LIST_ARTICLE_CATEGORIES,
} from '../../../Types/schema';
import { ArticleCategoryPayload } from '../../../../types/graphql';

interface Props {
  parentCategoryId: string;
  handleClose: Function;
}

const CreateCategory = (props: Props) => {
  const [addArticleCategory] = useMutation(UPDATE_CATEGORY);
  const [state, setState] = useState({ name: '' });

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const onSubmit = event => {
    event.preventDefault();
    const payload: ArticleCategoryPayload = {
      name: state.name,
      parentCategoryId: props.parentCategoryId,
    };
    addArticleCategory({
      variables: {
        payload,
      },
      update: (cache, { data: { addArticleCategory } }) => {
        const data: any = cache.readQuery({ query: LIST_ARTICLE_CATEGORIES });
        cache.writeQuery({
          query: LIST_ARTICLE_CATEGORIES,
          data: {
            articleCategories: [...data.articleCategories, addArticleCategory],
          },
        });
      },
    });
    props.handleClose();
  };
  return (
    <div className="create-category">
      <form method="GET" onSubmit={onSubmit} noValidate>
        <OakText
          data={state}
          id="name"
          handleChange={handleChange}
          label="Category name"
        />
      </form>
      <div className="action-footer">
        {state.name && (
          <OakButton theme="primary" variant="appear" action={onSubmit}>
            Save
          </OakButton>
        )}
        <OakButton theme="default" variant="appear" action={props.handleClose}>
          Cancel
        </OakButton>
      </div>
    </div>
  );
};

export default CreateCategory;
