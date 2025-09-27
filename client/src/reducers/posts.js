import {
  FETCH_ALL,
  FETCH_BY_SEARCH,
  FETCH_POST,
  CREATE,
  UPDATE,
  DELETE,
  START_LOADING,
  END_LOADING,
  COMMENT,
  LIKE,
} from "../constants/actionTypes";
export default (state = { isLoading: true, posts: [], post: null }, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };
    case FETCH_BY_SEARCH:
      return {
        ...state,
        posts: action.payload.data,
      };
    case FETCH_POST:
      return {
        ...state,
        post: action.payload,
      };
    case LIKE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id || post.id === action.payload.id
            ? action.payload
            : post
        ),
      };
    case COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (
            post._id === action.payload._id ||
            post.id === action.payload.id
          ) {
            return action.payload;
          }
          return post;
        }),
      };
    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };
    case UPDATE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id || post.id === action.payload.id
            ? action.payload
            : post
        ),
      };
    case DELETE:
      return {
        ...state,
        posts: state.posts.filter(
          (post) => post._id !== action.payload && post.id !== action.payload
        ),
        post:
          state.post?._id === action.payload ||
          state.post?.id === action.payload
            ? null
            : state.post,
      };
    default:
      return state;
  }
};
