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
  category?: Maybe<ArticleCategory>;
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

export type ArticleCategoryPayload = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parentCategoryId?: Maybe<Scalars['String']>;
};

export type ArticleCategory = {
  __typename?: 'ArticleCategory';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  parentCategoryId?: Maybe<Scalars['String']>;
  articles?: Maybe<Scalars['Int']>;
};

export type AssetPayload = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  jwtPassword?: Maybe<Scalars['String']>;
  productionMode?: Maybe<Scalars['Boolean']>;
};

export type AssetAdditionPayload = {
  email?: Maybe<Scalars['String']>;
};

export type Asset = {
  __typename?: 'Asset';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  jwtPassword?: Maybe<Scalars['String']>;
  productionMode?: Maybe<Scalars['Boolean']>;
  assetId?: Maybe<Scalars['String']>;
};

export type Session = {
  __typename?: 'Session';
  id: Scalars['ID'];
  sessionId: Scalars['String'];
  token: Scalars['String'];
};

export type UserSession = {
  __typename?: 'UserSession';
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type UserPayload = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  resolver?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  article?: Maybe<Article>;
  articles?: Maybe<ArticlePaginated>;
  searchArticles?: Maybe<ArticlePaginated>;
  tagCloud?: Maybe<Array<Maybe<TagCloud>>>;
  articlesByTag?: Maybe<TagPaginated>;
  feedback?: Maybe<Array<Maybe<Feedback>>>;
  articleCategory?: Maybe<ArticleCategory>;
  articleCategories?: Maybe<Array<Maybe<ArticleCategory>>>;
  asset?: Maybe<Asset>;
  assetById?: Maybe<Asset>;
  assets?: Maybe<Array<Maybe<Asset>>>;
  newEmailSession?: Maybe<Session>;
  newExternSession?: Maybe<Session>;
  session?: Maybe<UserSession>;
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

export type QueryArticleCategoryArgs = {
  id: Scalars['ID'];
};

export type QueryAssetArgs = {
  assetId: Scalars['String'];
};

export type QueryAssetByIdArgs = {
  id: Scalars['ID'];
};

export type QueryNewEmailSessionArgs = {
  email: Scalars['String'];
};

export type QueryNewExternSessionArgs = {
  token: Scalars['String'];
};

export type QuerySessionArgs = {
  key: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addArticle?: Maybe<Article>;
  deleteArticle?: Maybe<Article>;
  addFeedback?: Maybe<Feedback>;
  removeFeedback?: Maybe<Feedback>;
  addArticleCategory?: Maybe<ArticleCategory>;
  updateAsset?: Maybe<Asset>;
  createAsset?: Maybe<Asset>;
  createEmailAccount: User;
};

export type MutationAddArticleArgs = {
  payload?: Maybe<ArticlePayload>;
};

export type MutationDeleteArticleArgs = {
  id: Scalars['ID'];
};

export type MutationAddFeedbackArgs = {
  articleId: Scalars['String'];
  type: Scalars['String'];
};

export type MutationRemoveFeedbackArgs = {
  articleId: Scalars['String'];
  type: Scalars['String'];
};

export type MutationAddArticleCategoryArgs = {
  payload?: Maybe<ArticleCategoryPayload>;
};

export type MutationUpdateAssetArgs = {
  payload?: Maybe<AssetPayload>;
};

export type MutationCreateAssetArgs = {
  payload?: Maybe<AssetPayload>;
  addition?: Maybe<AssetAdditionPayload>;
};

export type MutationCreateEmailAccountArgs = {
  payload?: Maybe<UserPayload>;
};

export type AddArticleMutationVariables = {
  payload: ArticlePayload;
};

export type AddArticleMutation = { __typename?: 'Mutation' } & {
  addArticle?: Maybe<{ __typename?: 'Article' } & Pick<Article, 'id'>>;
};

export type CreateAssetMutationVariables = {
  payload: AssetPayload;
  addition: AssetAdditionPayload;
};

export type CreateAssetMutation = { __typename?: 'Mutation' } & {
  createAsset?: Maybe<{ __typename?: 'Asset' } & Pick<Asset, 'id'>>;
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
export const CreateAssetDocument = gql`
  mutation createAsset(
    $payload: AssetPayload!
    $addition: AssetAdditionPayload!
  ) {
    createAsset(payload: $payload, addition: $addition) {
      id
    }
  }
`;
export type CreateAssetMutationFn = ApolloReactCommon.MutationFunction<
  CreateAssetMutation,
  CreateAssetMutationVariables
>;
export type CreateAssetComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    CreateAssetMutation,
    CreateAssetMutationVariables
  >,
  'mutation'
>;

export const CreateAssetComponent = (props: CreateAssetComponentProps) => (
  <ApolloReactComponents.Mutation<
    CreateAssetMutation,
    CreateAssetMutationVariables
  >
    mutation={CreateAssetDocument}
    {...props}
  />
);

export type CreateAssetProps<
  TChildProps = {},
  TDataName extends string = 'mutate'
> = {
  [key in TDataName]: ApolloReactCommon.MutationFunction<
    CreateAssetMutation,
    CreateAssetMutationVariables
  >;
} &
  TChildProps;
export function withCreateAsset<
  TProps,
  TChildProps = {},
  TDataName extends string = 'mutate'
>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CreateAssetMutation,
    CreateAssetMutationVariables,
    CreateAssetProps<TChildProps, TDataName>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    CreateAssetMutation,
    CreateAssetMutationVariables,
    CreateAssetProps<TChildProps, TDataName>
  >(CreateAssetDocument, {
    alias: 'createAsset',
    ...operationOptions,
  });
}
export type CreateAssetMutationResult = ApolloReactCommon.MutationResult<
  CreateAssetMutation
>;
export type CreateAssetMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateAssetMutation,
  CreateAssetMutationVariables
>;
