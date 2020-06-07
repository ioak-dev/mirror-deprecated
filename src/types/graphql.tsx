import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as React from 'react';
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
  DateScalar: any;
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
  total?: Maybe<Scalars['Int']>;
  results: Array<Maybe<Article>>;
};

export type Article = {
  __typename?: 'Article';
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  views: Scalars['Int'];
  helpful: Scalars['Int'];
  notHelpful: Scalars['Int'];
  createdAt?: Maybe<Scalars['DateScalar']>;
  updatedAt?: Maybe<Scalars['DateScalar']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  feedback?: Maybe<Array<Maybe<Feedback>>>;
  category?: Maybe<Category>;
};

export type TagPaginated = {
  __typename?: 'TagPaginated';
  pageNo?: Maybe<Scalars['Int']>;
  hasMore?: Maybe<Scalars['Boolean']>;
  total?: Maybe<Scalars['Int']>;
  results: Array<Maybe<Tag>>;
};

export type TagCloud = {
  __typename?: 'TagCloud';
  name?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['Int']>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  article?: Maybe<Article>;
};

export type Feedback = {
  __typename?: 'Feedback';
  id: Scalars['ID'];
  type?: Maybe<Scalars['String']>;
  article?: Maybe<Article>;
  user?: Maybe<User>;
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
  searchArticles?: Maybe<ArticlePaginated>;
  tagCloud?: Maybe<Array<Maybe<TagCloud>>>;
  articlesByTag?: Maybe<TagPaginated>;
  feedback?: Maybe<Array<Maybe<Feedback>>>;
  category?: Maybe<Category>;
  categories?: Maybe<Array<Maybe<Category>>>;
  session?: Maybe<User>;
};

export type QueryArticleArgs = {
  id: Scalars['ID'];
};

export type QueryArticlesArgs = {
  categoryId: Scalars['ID'];
  pageSize?: Maybe<Scalars['Int']>;
  pageNo?: Maybe<Scalars['Int']>;
};

export type QuerySearchArticlesArgs = {
  text?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['Int']>;
  pageNo?: Maybe<Scalars['Int']>;
};

export type QueryArticlesByTagArgs = {
  tag: Scalars['String'];
  pageSize?: Maybe<Scalars['Int']>;
  pageNo?: Maybe<Scalars['Int']>;
};

export type QueryFeedbackArgs = {
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
  addFeedback?: Maybe<Feedback>;
  removeFeedback?: Maybe<Feedback>;
  addCategory?: Maybe<Category>;
};

export type MutationAddArticleArgs = {
  payload?: Maybe<ArticlePayload>;
};

export type MutationAddFeedbackArgs = {
  articleId: Scalars['String'];
  type: Scalars['String'];
};

export type MutationRemoveFeedbackArgs = {
  articleId: Scalars['String'];
  type: Scalars['String'];
};

export type MutationAddCategoryArgs = {
  payload?: Maybe<CategoryPayload>;
};

export type AddArticleMutationVariables = {
  payload: ArticlePayload;
};

export type AddArticleMutation = { __typename?: 'Mutation' } & {
  addArticle?: Maybe<{ __typename?: 'Article' } & Pick<Article, 'id'>>;
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
