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
  MARK_STALE,
  REFRESH_CACHE,
  CLEAR_SEARCH,
} from "../constants/actionTypes";
import { REHYDRATE } from "redux-persist";
export default (
  state = {
    isLoading: true,
    posts: [],
    post: null,
    searchResults: [], // Separate array for search results
    lastFetched: null,
    cacheExpiry: 5 * 60 * 1000, // 5 minutes in milliseconds
    isStale: false,
    currentPage: 1,
    numberOfPages: 1,
  },
  action
) => {
  // Log all actions to track what's happening
  console.log("🔍 Posts Reducer Action:", action.type, {
    currentPostsCount: state.posts?.length || 0,
    actionPayload: action.payload,
  });
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ALL:
      console.log(
        "📥 FETCH_ALL reducer - Replacing posts with:",
        action.payload.data.length,
        "posts"
      );
      console.log(
        "📥 FETCH_ALL reducer - Previous posts count:",
        state.posts.length
      );
      console.log(
        "📥 FETCH_ALL reducer - New post IDs:",
        action.payload.data.map((p) => p.id || p._id)
      );
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
        lastFetched: Date.now(),
        isStale: false,
      };
    case FETCH_BY_SEARCH:
      console.log("🔍 FETCH_BY_SEARCH - Storing search results separately");
      return {
        ...state,
        searchResults: action.payload.data, // Store search results separately
        // Don't update main posts array or cache metadata
      };
    case FETCH_POST:
      return {
        ...state,
        post: action.payload,
      };
    case LIKE:
      console.log("🟠 LIKE reducer called", {
        payload: action.payload,
        currentPosts: state.posts.length,
        postId: action.payload?.id || action.payload?._id,
        existingPostIds: state.posts.map((p) => p.id || p._id),
      });

      // Check if post already exists
      const existingPostIndex = state.posts.findIndex((post) => {
        const postId = post.id || post._id;
        const payloadId = action.payload.id || action.payload._id;
        return postId === payloadId;
      });

      console.log("🟠 Post found at index:", existingPostIndex);

      const updatedState = {
        ...state,
        posts: state.posts.map((post) => {
          const postId = post.id || post._id;
          const payloadId = action.payload.id || action.payload._id;
          return postId === payloadId ? action.payload : post;
        }),
      };

      console.log("🟠 LIKE reducer result:", {
        updatedPosts: updatedState.posts.length,
        updatedPost: updatedState.posts.find((p) => {
          const postId = p.id || p._id;
          const payloadId = action.payload.id || action.payload._id;
          return postId === payloadId;
        }),
        allPostIds: updatedState.posts.map((p) => p.id || p._id),
      });
      return updatedState;
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
      console.log(
        "📝 CREATE reducer - Current posts count:",
        state.posts.length
      );
      console.log("📝 CREATE reducer - Adding new post:", action.payload);
      console.log(
        "📝 CREATE reducer - Current post IDs:",
        state.posts.map((p) => p.id || p._id)
      );

      // Check if post already exists to avoid duplicates
      const existingPost = state.posts.find((post) => {
        const postId = post.id || post._id;
        const payloadId = action.payload.id || action.payload._id;
        return postId === payloadId;
      });

      if (existingPost) {
        console.log(
          "📝 CREATE reducer - Post already exists, updating instead of adding"
        );
        return {
          ...state,
          posts: state.posts.map((post) => {
            const postId = post.id || post._id;
            const payloadId = action.payload.id || action.payload._id;
            return postId === payloadId ? action.payload : post;
          }),
        };
      }

      // Add new post to the beginning of the array (most recent first)
      const newPosts = [action.payload, ...state.posts];
      console.log("📝 CREATE reducer - New posts count:", newPosts.length);
      console.log(
        "📝 CREATE reducer - New post IDs:",
        newPosts.map((p) => p.id || p._id)
      );

      return {
        ...state,
        posts: newPosts,
        // Don't mark as stale - we're updating the cache with the new post
        // isStale: false, // Keep cache fresh since we updated it
      };
    case UPDATE:
      return {
        ...state,
        posts: state.posts.map((post) => {
          const postId = post.id || post._id;
          const payloadId = action.payload.id || action.payload._id;
          return postId === payloadId ? action.payload : post;
        }),
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
        isStale: true, // Mark as stale since we deleted a post
      };
    case MARK_STALE:
      return {
        ...state,
        isStale: true,
      };
    case REFRESH_CACHE:
      console.log(
        "🔄 REFRESH_CACHE reducer - Current posts count:",
        state.posts.length
      );
      console.log(
        "🔄 REFRESH_CACHE reducer - Posts:",
        state.posts.map((p) => p.id || p._id)
      );
      return {
        ...state,
        isStale: false,
        lastFetched: Date.now(),
      };
    case CLEAR_SEARCH:
      console.log("🔍 CLEAR_SEARCH - Clearing search results");
      return {
        ...state,
        searchResults: [],
      };
    case REHYDRATE:
      console.log(
        "🔄 REHYDRATE - Restoring posts from storage:",
        action.payload?.posts?.posts?.length || 0
      );
      if (action.payload?.posts) {
        return {
          ...action.payload.posts,
          isLoading: false, // Don't show loading when rehydrating
        };
      }
      return state;
    default:
      return state;
  }
};
