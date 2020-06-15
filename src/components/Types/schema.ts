import gql from 'graphql-tag';

export const GET_SESSION = gql`
  query Session($key: ID!, $asset: String) {
    session(key: $key, asset: $asset) {
      id
      firstName
      lastName
      email
      token
    }
  }
`;

export const NEW_EMAIL_SESSION = gql`
  query NewEmailSession($email: String!) {
    newEmailSession(email: $email) {
      sessionId
    }
  }
`;

export const NEW_EXTERN_SESSION = gql`
  query NewExternSession($token: String!) {
    newExternSession(token: $token) {
      sessionId
    }
  }
`;

export const CREATE_EMAIL_ACCOUNT = gql`
  mutation CreateEmailAccount($payload: UserPayload) {
    createEmailAccount(payload: $payload) {
      id
      email
    }
  }
`;

export const LIST_ARTICLES = gql`
  query Articles($categoryId: ID!, $pageNo: Int, $pageSize: Int) {
    articles(categoryId: $categoryId, pageNo: $pageNo, pageSize: $pageSize) {
      results {
        id
        title
        description
        views
        helpful
        notHelpful
        createdAt
        updatedAt
        tags {
          id
          name
        }
      }
      pageNo
      hasMore
    }
  }
`;

export const SEARCH_ARTICLES = gql`
  query SearchArticles($text: String, $pageNo: Int, $pageSize: Int) {
    searchArticles(text: $text, pageNo: $pageNo, pageSize: $pageSize) {
      results {
        id
        title
        description
        views
        helpful
        notHelpful
        createdAt
        updatedAt
        tags {
          id
          name
        }
      }
      pageNo
      hasMore
      total
    }
  }
`;

export const GET_ARTICLE = gql`
  query Article($id: ID!) {
    article(id: $id) {
      id
      title
      description
      views
      helpful
      notHelpful
      createdAt
      updatedAt
      tags {
        id
        name
      }
      category {
        id
      }
      feedback {
        type
      }
    }
  }
`;

export const ARTICLES_BY_TAG = gql`
  query ArticlesByTag($tag: String!, $pageNo: Int, $pageSize: Int) {
    articlesByTag(tag: $tag, pageNo: $pageNo, pageSize: $pageSize) {
      results {
        id
        name
        article {
          id
          title
          description
          views
          helpful
          notHelpful
          createdAt
          updatedAt
          tags {
            id
            name
          }
        }
      }
      pageNo
      hasMore
    }
  }
`;

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($payload: ArticlePayload!) {
    addArticle(payload: $payload) {
      id
      title
      description
      views
      helpful
      notHelpful
      createdAt
      updatedAt
      tags {
        id
        name
      }
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id) {
      id
    }
  }
`;

export const LIST_ARTICLE_CATEGORIES = gql`
  query ArticleCategories {
    articleCategories {
      id
      name
      parentCategoryId
      articles
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($payload: ArticleCategoryPayload!) {
    addArticleCategory(payload: $payload) {
      id
      name
      parentCategoryId
      articles
    }
  }
`;

export const ADD_FEEDBACK = gql`
  mutation AddFeedback($articleId: String!, $type: String!) {
    addFeedback(articleId: $articleId, type: $type) {
      id
      article {
        id
        title
        description
        views
        helpful
        notHelpful
        createdAt
        updatedAt
        tags {
          id
          name
        }
        category {
          id
        }
        feedback {
          type
        }
      }
    }
  }
`;

export const REMOVE_FEEDBACK = gql`
  mutation RemoveFeedback($articleId: String!, $type: String!) {
    removeFeedback(articleId: $articleId, type: $type) {
      id
      article {
        id
        title
        description
        views
        helpful
        notHelpful
        createdAt
        updatedAt
        tags {
          id
          name
        }
        category {
          id
        }
        feedback {
          type
        }
      }
    }
  }
`;

export const TAG_CLOUD = gql`
  query TagCloud {
    tagCloud {
      name
      count
    }
  }
`;

export const LIST_ASSETS = gql`
  query Assets {
    assets {
      id
      name
      description
      jwtPassword
      productionMode
      assetId
    }
  }
`;

export const GET_ASSET = gql`
  query Asset($assetId: String!) {
    asset(assetId: $assetId) {
      id
      name
      description
      jwtPassword
      productionMode
      assetId
    }
  }
`;

export const CREATE_ASSET = gql`
  mutation CreateAsset(
    $payload: AssetPayload!
    $addition: AssetAdditionPayload!
  ) {
    CreateAsset(payload: $payload, addition: $addition) {
      id
      name
      description
      jwtPassword
      productionMode
      assetId
    }
  }
`;

export const UPDATE_ASSET = gql`
  mutation UpdateAsset($payload: AssetPayload!) {
    updateAsset(payload: $payload) {
      id
      name
      description
      jwtPassword
      productionMode
      assetId
    }
  }
`;
