import * as React from 'react';
import { shallow } from 'enzyme';

import ArticleItem from './ArticleItem';

const article = {
  _id: '5e04ae30d9e3d3bc0b7f8a1e',
  category: 'Popular Science',
  question:
    'Suspendisse mattis ligula et volutpat pulvinar. Maecenas sodales ut ligula sed lobortis',
  answer: 'Suspendisse mattis',
};

describe('ArticleItem component interaction', () => {
  const mockFn = jest.fn();
  let mockEditArticleFunction;
  let mockDeleteArticleFunction;

  beforeEach(() => {
    mockEditArticleFunction = jest.fn();
    mockDeleteArticleFunction = jest.fn();
  });

  it('should load when initialized', () => {
    const wrapper = shallow(
      <ArticleItem
        id="1"
        editArticle={mockFn}
        confirmDeleteFaq={mockFn}
        article={article}
      />
    );
    expect(wrapper.find('.article-record')).toHaveLength(1);
  });

  it('should call edit article function when edit icon is clicked', () => {
    const wrapper = shallow(
      <ArticleItem
        id="1"
        editArticle={mockEditArticleFunction}
        confirmDeleteFaq={mockFn}
        article={article}
      />
    );
    wrapper.find('[data-test="article-edit"]').simulate('click');
    expect(mockEditArticleFunction).toBeCalledTimes(1);
  });

  it('should call delete article function when delete icon is clicked', () => {
    const wrapper = shallow(
      <ArticleItem
        id="1"
        editArticle={mockFn}
        confirmDeleteFaq={mockDeleteArticleFunction}
        article={article}
      />
    );
    wrapper.find('[data-test="article-delete"]').simulate('click');
    expect(mockDeleteArticleFunction).toBeCalledTimes(1);
  });
});
