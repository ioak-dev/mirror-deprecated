import gql from 'graphql-tag';

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

export const LIST_CATEGORIES = gql`
  query Categories {
    categories {
      id
      name
      parentCategoryId
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($payload: CategoryPayload!) {
    addCategory(payload: $payload) {
      id
      name
      parentCategoryId
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
