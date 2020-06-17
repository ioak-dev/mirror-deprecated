import gql from 'graphql-tag';

export const LIST_POSTS = gql`
  query Posts($categoryId: ID!, $pageNo: Int, $pageSize: Int) {
    posts(categoryId: $categoryId, pageNo: $pageNo, pageSize: $pageSize) {
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

export const SEARCH_POSTS = gql`
  query SearchPosts($text: String, $pageNo: Int, $pageSize: Int) {
    searchPosts(text: $text, pageNo: $pageNo, pageSize: $pageSize) {
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

export const GET_POST = gql`
  query Post($id: ID!) {
    post(id: $id) {
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

export const POSTS_BY_TAG = gql`
  query PostsByTag($tag: String!, $pageNo: Int, $pageSize: Int) {
    postsByTag(tag: $tag, pageNo: $pageNo, pageSize: $pageSize) {
      results {
        id
        name
        post {
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

export const UPDATE_POST = gql`
  mutation UpdatePost($payload: PostPayload!) {
    addPost(payload: $payload) {
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

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

export const LIST_POST_CATEGORIES = gql`
  query PostCategories {
    postCategories {
      id
      name
      parentCategoryId
      posts
    }
  }
`;

export const UPDATE_POST_CATEGORY = gql`
  mutation UpdatePostCategory($payload: PostCategoryPayload!) {
    addPostCategory(payload: $payload) {
      id
      name
      parentCategoryId
      posts
    }
  }
`;

export const ADD_POST_FEEDBACK = gql`
  mutation AddPostFeedback($postId: String!, $type: String!) {
    addPostFeedback(postId: $postId, type: $type) {
      id
      post {
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

export const REMOVE_POST_FEEDBACK = gql`
  mutation RemovePostFeedback($postId: String!, $type: String!) {
    removePostFeedback(postId: $postId, type: $type) {
      id
      post {
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

export const POST_TAG_CLOUD = gql`
  query PostTagCloud {
    postTagCloud {
      name
      count
    }
  }
`;
