import gql from 'graphql-tag';
import * as React from 'react';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ArticlePayload = {
  id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  categoryId?: Maybe<Scalars['String']>;
  addTags?: Maybe<Array<Maybe<Scalars['String']>>>;
  removeTags?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ArticlePaginated = {
  __typename?: 'ArticlePaginated';
  pageNo?: Maybe<Scalars['Int']>;
  hasMore?: Maybe<Scalars['Boolean']>;
  results: Array<Maybe<Article>>;
};

export type Article = {
  __typename?: 'Article';
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  category?: Maybe<Category>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  article?: Maybe<Article>;
};

export type CategoryPayload = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parentCategoryId?: Maybe<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  parentCategoryId?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  article?: Maybe<Article>;
  articles?: Maybe<ArticlePaginated>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  category?: Maybe<Category>;
  categories?: Maybe<Array<Maybe<Category>>>;
  session?: Maybe<User>;
};

export type QueryArticleArgs = {
  id: Scalars['ID'];
};

export type QueryArticlesArgs = {
  categoryId?: Maybe<Scalars['ID']>;
  pageSize?: Maybe<Scalars['Int']>;
  pageNo?: Maybe<Scalars['Int']>;
};

export type QueryTagsArgs = {
  articleId: Scalars['ID'];
};

export type QueryCategoryArgs = {
  id: Scalars['ID'];
};

export type QuerySessionArgs = {
  key: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addArticle?: Maybe<Article>;
  addCategory?: Maybe<Category>;
};

export type MutationAddArticleArgs = {
  payload?: Maybe<ArticlePayload>;
};

export type MutationAddCategoryArgs = {
  payload?: Maybe<CategoryPayload>;
};

export type ArticlesQueryVariables = {
  categoryId?: Maybe<Scalars['ID']>;
  pageNo?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type ArticlesQuery = { __typename?: 'Query' } & {
  articles?: Maybe<
    { __typename?: 'ArticlePaginated' } & Pick<
      ArticlePaginated,
      'pageNo' | 'hasMore'
    > & {
        results: Array<
          Maybe<
            { __typename?: 'Article' } & Pick<
              Article,
              'id' | 'title' | 'description'
            >
          >
        >;
      }
  >;
};

export type CategoriesQueryVariables = {};

export type CategoriesQuery = { __typename?: 'Query' } & {
  categories?: Maybe<
    Array<
      Maybe<
        { __typename?: 'Category' } & Pick<
          Category,
          'id' | 'name' | 'parentCategoryId'
        >
      >
    >
  >;
};

export type AddArticleMutationVariables = {
  payload: ArticlePayload;
};

export type AddArticleMutation = { __typename?: 'Mutation' } & {
  addArticle?: Maybe<{ __typename?: 'Article' } & Pick<Article, 'id'>>;
};

export type UpdateArticleMutationVariables = {
  payload: ArticlePayload;
};

export type UpdateArticleMutation = { __typename?: 'Mutation' } & {
  addArticle?: Maybe<{ __typename?: 'Article' } & Pick<Article, 'id'>>;
};

export type ArticleQueryVariables = {
  id: Scalars['ID'];
};

export type ArticleQuery = { __typename?: 'Query' } & {
  article?: Maybe<
    { __typename?: 'Article' } & Pick<
      Article,
      'id' | 'title' | 'description'
    > & {
        tags?: Maybe<
          Array<Maybe<{ __typename?: 'Tag' } & Pick<Tag, 'id' | 'name'>>>
        >;
      }
  >;
};

export type ArticleTwoQueryVariables = {
  id: Scalars['ID'];
};

export type ArticleTwoQuery = { __typename?: 'Query' } & {
  article?: Maybe<
    { __typename?: 'Article' } & Pick<
      Article,
      'id' | 'title' | 'description'
    > & {
        tags?: Maybe<
          Array<Maybe<{ __typename?: 'Tag' } & Pick<Tag, 'id' | 'name'>>>
        >;
      }
  >;
};

export type SessionQueryVariables = {
  key: Scalars['ID'];
};

export type SessionQuery = { __typename?: 'Query' } & {
  session?: Maybe<
    { __typename?: 'User' } & Pick<
      User,
      'id' | 'firstName' | 'lastName' | 'email' | 'token'
    >
  >;
};

export const ArticlesDocument = gql`
  query Articles($categoryId: ID, $pageNo: Int, $pageSize: Int) {
    articles(categoryId: $categoryId, pageNo: $pageNo, pageSize: $pageSize) {
      results {
        id
        title
        description
      }
      pageNo
      hasMore
    }
  }
`;
export type ArticlesComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    ArticlesQuery,
    ArticlesQueryVariables
  >,
  'query'
>;

export const ArticlesComponent = (props: ArticlesComponentProps) => (
  <ApolloReactComponents.Query<ArticlesQuery, ArticlesQueryVariables>
    query={ArticlesDocument}
    {...props}
  />
);

export type ArticlesProps<
  TChildProps = {},
  TDataName extends string = 'data'
> = {
  [key in TDataName]: ApolloReactHoc.DataValue<
    ArticlesQuery,
    ArticlesQueryVariables
  >;
} &
  TChildProps;
export function withArticles<
  TProps,
  TChildProps = {},
  TDataName extends string = 'data'
>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    ArticlesQuery,
    ArticlesQueryVariables,
    ArticlesProps<TChildProps, TDataName>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    ArticlesQuery,
    ArticlesQueryVariables,
    ArticlesProps<TChildProps, TDataName>
  >(ArticlesDocument, {
    alias: 'articles',
    ...operationOptions,
  });
}
export type ArticlesQueryResult = ApolloReactCommon.QueryResult<
  ArticlesQuery,
  ArticlesQueryVariables
>;
export const CategoriesDocument = gql`
  query Categories {
    categories {
      id
      name
      parentCategoryId
    }
  }
`;
export type CategoriesComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    CategoriesQuery,
    CategoriesQueryVariables
  >,
  'query'
>;

export const CategoriesComponent = (props: CategoriesComponentProps) => (
  <ApolloReactComponents.Query<CategoriesQuery, CategoriesQueryVariables>
    query={CategoriesDocument}
    {...props}
  />
);

export type CategoriesProps<
  TChildProps = {},
  TDataName extends string = 'data'
> = {
  [key in TDataName]: ApolloReactHoc.DataValue<
    CategoriesQuery,
    CategoriesQueryVariables
  >;
} &
  TChildProps;
export function withCategories<
  TProps,
  TChildProps = {},
  TDataName extends string = 'data'
>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CategoriesQuery,
    CategoriesQueryVariables,
    CategoriesProps<TChildProps, TDataName>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    CategoriesQuery,
    CategoriesQueryVariables,
    CategoriesProps<TChildProps, TDataName>
  >(CategoriesDocument, {
    alias: 'categories',
    ...operationOptions,
  });
}
export type CategoriesQueryResult = ApolloReactCommon.QueryResult<
  CategoriesQuery,
  CategoriesQueryVariables
>;
export const AddArticleDocument = gql`
  mutation AddArticle($payload: ArticlePayload!) {
    addArticle(payload: $payload) {
      id
    }
  }
`;
export type AddArticleMutationFn = ApolloReactCommon.MutationFunction<
  AddArticleMutation,
  AddArticleMutationVariables
>;
export type AddArticleComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    AddArticleMutation,
    AddArticleMutationVariables
  >,
  'mutation'
>;

export const AddArticleComponent = (props: AddArticleComponentProps) => (
  <ApolloReactComponents.Mutation<
    AddArticleMutation,
    AddArticleMutationVariables
  >
    mutation={AddArticleDocument}
    {...props}
  />
);

export type AddArticleProps<
  TChildProps = {},
  TDataName extends string = 'mutate'
> = {
  [key in TDataName]: ApolloReactCommon.MutationFunction<
    AddArticleMutation,
    AddArticleMutationVariables
  >;
} &
  TChildProps;
export function withAddArticle<
  TProps,
  TChildProps = {},
  TDataName extends string = 'mutate'
>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    AddArticleMutation,
    AddArticleMutationVariables,
    AddArticleProps<TChildProps, TDataName>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    AddArticleMutation,
    AddArticleMutationVariables,
    AddArticleProps<TChildProps, TDataName>
  >(AddArticleDocument, {
    alias: 'addArticle',
    ...operationOptions,
  });
}
export type AddArticleMutationResult = ApolloReactCommon.MutationResult<
  AddArticleMutation
>;
export type AddArticleMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddArticleMutation,
  AddArticleMutationVariables
>;
export const UpdateArticleDocument = gql`
  mutation UpdateArticle($payload: ArticlePayload!) {
    addArticle(payload: $payload) {
      id
    }
  }
`;
export type UpdateArticleMutationFn = ApolloReactCommon.MutationFunction<
  UpdateArticleMutation,
  UpdateArticleMutationVariables
>;
export type UpdateArticleComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    UpdateArticleMutation,
    UpdateArticleMutationVariables
  >,
  'mutation'
>;

export const UpdateArticleComponent = (props: UpdateArticleComponentProps) => (
  <ApolloReactComponents.Mutation<
    UpdateArticleMutation,
    UpdateArticleMutationVariables
  >
    mutation={UpdateArticleDocument}
    {...props}
  />
);

export type UpdateArticleProps<
  TChildProps = {},
  TDataName extends string = 'mutate'
> = {
  [key in TDataName]: ApolloReactCommon.MutationFunction<
    UpdateArticleMutation,
    UpdateArticleMutationVariables
  >;
} &
  TChildProps;
export function withUpdateArticle<
  TProps,
  TChildProps = {},
  TDataName extends string = 'mutate'
>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    UpdateArticleMutation,
    UpdateArticleMutationVariables,
    UpdateArticleProps<TChildProps, TDataName>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    UpdateArticleMutation,
    UpdateArticleMutationVariables,
    UpdateArticleProps<TChildProps, TDataName>
  >(UpdateArticleDocument, {
    alias: 'updateArticle',
    ...operationOptions,
  });
}
export type UpdateArticleMutationResult = ApolloReactCommon.MutationResult<
  UpdateArticleMutation
>;
export type UpdateArticleMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateArticleMutation,
  UpdateArticleMutationVariables
>;
export const ArticleDocument = gql`
  query Article($id: ID!) {
    article(id: $id) {
      id
      title
      description
      tags {
        id
        name
      }
    }
  }
`;
export type ArticleComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    ArticleQuery,
    ArticleQueryVariables
  >,
  'query'
> &
  ({ variables: ArticleQueryVariables; skip?: boolean } | { skip: boolean });

export const ArticleComponent = (props: ArticleComponentProps) => (
  <ApolloReactComponents.Query<ArticleQuery, ArticleQueryVariables>
    query={ArticleDocument}
    {...props}
  />
);

export type ArticleProps<
  TChildProps = {},
  TDataName extends string = 'data'
> = {
  [key in TDataName]: ApolloReactHoc.DataValue<
    ArticleQuery,
    ArticleQueryVariables
  >;
} &
  TChildProps;
export function withArticle<
  TProps,
  TChildProps = {},
  TDataName extends string = 'data'
>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    ArticleQuery,
    ArticleQueryVariables,
    ArticleProps<TChildProps, TDataName>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    ArticleQuery,
    ArticleQueryVariables,
    ArticleProps<TChildProps, TDataName>
  >(ArticleDocument, {
    alias: 'article',
    ...operationOptions,
  });
}
export type ArticleQueryResult = ApolloReactCommon.QueryResult<
  ArticleQuery,
  ArticleQueryVariables
>;
export const ArticleTwoDocument = gql`
  query ArticleTwo($id: ID!) {
    article(id: $id) {
      id
      title
      description
      tags {
        id
        name
      }
    }
  }
`;
export type ArticleTwoComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    ArticleTwoQuery,
    ArticleTwoQueryVariables
  >,
  'query'
> &
  ({ variables: ArticleTwoQueryVariables; skip?: boolean } | { skip: boolean });

export const ArticleTwoComponent = (props: ArticleTwoComponentProps) => (
  <ApolloReactComponents.Query<ArticleTwoQuery, ArticleTwoQueryVariables>
    query={ArticleTwoDocument}
    {...props}
  />
);

export type ArticleTwoProps<
  TChildProps = {},
  TDataName extends string = 'data'
> = {
  [key in TDataName]: ApolloReactHoc.DataValue<
    ArticleTwoQuery,
    ArticleTwoQueryVariables
  >;
} &
  TChildProps;
export function withArticleTwo<
  TProps,
  TChildProps = {},
  TDataName extends string = 'data'
>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    ArticleTwoQuery,
    ArticleTwoQueryVariables,
    ArticleTwoProps<TChildProps, TDataName>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    ArticleTwoQuery,
    ArticleTwoQueryVariables,
    ArticleTwoProps<TChildProps, TDataName>
  >(ArticleTwoDocument, {
    alias: 'articleTwo',
    ...operationOptions,
  });
}
export type ArticleTwoQueryResult = ApolloReactCommon.QueryResult<
  ArticleTwoQuery,
  ArticleTwoQueryVariables
>;
export const SessionDocument = gql`
  query Session($key: ID!) {
    session(key: $key) {
      id
      firstName
      lastName
      email
      token
    }
  }
`;
export type SessionComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    SessionQuery,
    SessionQueryVariables
  >,
  'query'
> &
  ({ variables: SessionQueryVariables; skip?: boolean } | { skip: boolean });

export const SessionComponent = (props: SessionComponentProps) => (
  <ApolloReactComponents.Query<SessionQuery, SessionQueryVariables>
    query={SessionDocument}
    {...props}
  />
);

export type SessionProps<
  TChildProps = {},
  TDataName extends string = 'data'
> = {
  [key in TDataName]: ApolloReactHoc.DataValue<
    SessionQuery,
    SessionQueryVariables
  >;
} &
  TChildProps;
export function withSession<
  TProps,
  TChildProps = {},
  TDataName extends string = 'data'
>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    SessionQuery,
    SessionQueryVariables,
    SessionProps<TChildProps, TDataName>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    SessionQuery,
    SessionQueryVariables,
    SessionProps<TChildProps, TDataName>
  >(SessionDocument, {
    alias: 'session',
    ...operationOptions,
  });
}
export type SessionQueryResult = ApolloReactCommon.QueryResult<
  SessionQuery,
  SessionQueryVariables
>;
