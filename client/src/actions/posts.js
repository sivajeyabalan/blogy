import * as api from "../api";
import {
  FETCH_ALL,
  FETCH_BY_SEARCH,
  CREATE,
  UPDATE,
  DELETE,
  FETCH_POST,
  LIKE,
  START_LOADING,
  END_LOADING,
  COMMENT,
  MARK_STALE,
  REFRESH_CACHE,
  CLEAR_SEARCH,
} from "../constants/actionTypes";

// Cache utility functions
const isCacheValid = (lastFetched, cacheExpiry) => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < cacheExpiry;
};

const shouldFetchPosts = (state, page) => {
  console.log("🔍 Cache validation:", {
    hasPosts: !!(state.posts && state.posts.length > 0),
    postsCount: state.posts?.length || 0,
    currentPage: state.currentPage,
    requestedPage: page,
    isStale: state.isStale,
    lastFetched: state.lastFetched,
    cacheValid: isCacheValid(state.lastFetched, state.cacheExpiry),
  });

  // Always fetch if no posts
  if (!state.posts || state.posts.length === 0) {
    console.log("🔍 No posts in cache, fetching...");
    return true;
  }

  // Fetch if explicitly marked as stale
  if (state.isStale) {
    console.log("🔍 Cache marked as stale, fetching...");
    return true;
  }

  // Fetch if different page is requested
  if (state.currentPage && state.currentPage !== parseInt(page)) {
    console.log("🔍 Different page requested, fetching...");
    return true;
  }

  // Check if cache is expired
  const expired = !isCacheValid(state.lastFetched, state.cacheExpiry);
  if (expired) {
    console.log("🔍 Cache expired, fetching...");
  } else {
    console.log("📦 Using cached posts");
  }

  return expired;
};

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPost(id);
    dispatch({ type: FETCH_POST, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const getPosts =
  (page, forceRefresh = false) =>
  async (dispatch, getState) => {
    try {
      const state = getState().posts;

      // Check if we should fetch or use cache
      if (!forceRefresh && !shouldFetchPosts(state, page)) {
        console.log("📦 Using cached posts data");
        return;
      }

      console.log("🔄 Fetching fresh posts data");
      dispatch({ type: START_LOADING });
      const {
        data: { data, currentPage, numberOfPages },
      } = await api.fetchPosts(page);

      dispatch({
        type: FETCH_ALL,
        payload: { data, currentPage, numberOfPages },
      });
      dispatch({ type: END_LOADING });
    } catch (error) {
      console.log(error);
      dispatch({ type: END_LOADING });
    }
  };

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data },
    } = await api.fetchPostsBySearch({
      search: searchQuery.search,
      tags: searchQuery.tags,
    });
    dispatch({ type: FETCH_BY_SEARCH, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post, navigate) => async (dispatch, getState) => {
  try {
    console.log("🚀 createPost action started");
    const stateBefore = getState().posts;
    console.log("🚀 State before create:", {
      postsCount: stateBefore.posts?.length || 0,
      postIds: stateBefore.posts?.map((p) => p.id || p._id) || [],
    });

    dispatch({ type: START_LOADING });

    // Create FormData if there's a file, otherwise send JSON
    let postData = post;
    if (post.selectedFile instanceof File) {
      const formData = new FormData();
      formData.append("file", post.selectedFile);
      formData.append("title", post.title);
      formData.append("message", post.message);
      formData.append("tags", JSON.stringify(post.tags));
      formData.append("name", post.name);
      postData = formData;
    } else {
      // Remove the selectedFile if it's not a File object
      const { selectedFile, ...jsonData } = post;
      postData = jsonData;
    }

    const { data } = await api.createPost(postData);
    const postId = data.id || data._id;

    console.log("🚀 Post created successfully, navigating to:", postId);

    // Add the new post to the cache instead of refetching
    dispatch({ type: CREATE, payload: data });
    console.log("✅ Post created and added to cache");

    // Check state after CREATE action
    const stateAfter = getState().posts;
    console.log("🚀 State after create:", {
      postsCount: stateAfter.posts?.length || 0,
      postIds: stateAfter.posts?.map((p) => p.id || p._id) || [],
    });

    if (postId) {
      navigate(`/posts/${postId}`);
    }
  } catch (error) {
    console.error("Create post error:", error.response?.data || error.message);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    console.log("🔍 updatePost action - id:", id, "type:", typeof id);
    let payload = post;
    if (post.selectedFile instanceof File) {
      const formData = new FormData();
      formData.append("file", post.selectedFile);
      formData.append("title", post.title || "");
      formData.append("message", post.message || "");
      formData.append("tags", JSON.stringify(post.tags || []));
      if (post.name) formData.append("name", post.name);
      if (post.removeImage) formData.append("removeImage", "true");
      payload = formData;
    }
    const { data } = await api.updatePost(id, payload);

    // Update the post in cache instead of refetching
    dispatch({ type: UPDATE, payload: data });
    console.log("✅ Post updated in cache");
  } catch (error) {
    console.error("Update post error:", error.response?.data || error.message);
  }
};

export const deletePost = (id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const response = await api.deletePost(id);

    if (response.status === 200) {
      // Remove from cache instead of refetching
      dispatch({ type: DELETE, payload: id });
      console.log("✅ Post deleted from cache");

      if (window.location.pathname === `/posts/${id}`) {
        navigate("/");
      }
    }
  } catch (error) {
    console.error("Delete post error:", error);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    console.log("🟡 Redux likePost action called with id:", id);
    const { data } = await api.likePost(id);
    console.log("🟡 API response data:", data);

    // Update the post in cache instead of refetching
    dispatch({ type: LIKE, payload: data });
    console.log("✅ Post like updated in cache");
  } catch (error) {
    console.error("🟡 Redux likePost error:", error);
    console.error("🟡 Error response:", error.response?.data);
    console.error("🟡 Error status:", error.response?.status);
    throw error; // Re-throw to allow component to handle it
  }
};

export const commentPost = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(value, id);

    // Update the post in cache instead of refetching
    dispatch({ type: COMMENT, payload: data });
    console.log("✅ Post comment updated in cache");
    return data.comments || data.comment || [];
  } catch (error) {
    console.error("Comment post error:", error.response?.data || error.message);
    throw error; // Re-throw to allow component to handle it
  }
};

// Add utility actions for cache management
export const markCacheStale = () => ({
  type: MARK_STALE,
});

export const refreshCache = () => ({
  type: REFRESH_CACHE,
});

export const clearSearch = () => ({
  type: CLEAR_SEARCH,
});

// Smart refresh function that only fetches if needed
export const smartRefreshPosts = (page) => async (dispatch, getState) => {
  const state = getState().posts;
  console.log("🔄 smartRefreshPosts called with page:", page);
  console.log("🔄 Current cache state:", {
    postsCount: state.posts?.length || 0,
    currentPage: state.currentPage,
    isStale: state.isStale,
    lastFetched: state.lastFetched,
    postIds: state.posts?.map((p) => p.id || p._id) || [],
  });

  // If we're requesting a different page than what's cached, always fetch
  if (state.currentPage && state.currentPage !== parseInt(page)) {
    console.log("📄 Different page requested, fetching new data");
    // Clear search results when changing pages
    dispatch(clearSearch());
    dispatch(getPosts(page, true)); // Force refresh for different page
    return;
  }

  // If we have posts and they're not stale, don't fetch
  if (
    state.posts &&
    state.posts.length > 0 &&
    !state.isStale &&
    isCacheValid(state.lastFetched, state.cacheExpiry)
  ) {
    console.log("📦 Cache is fresh and has posts, no refresh needed");
    return;
  }

  // If we have posts but cache is expired, still don't fetch immediately
  // Let the user manually refresh if they want fresh data
  if (state.posts && state.posts.length > 0 && !state.isStale) {
    console.log("📦 Cache has posts but is expired, using cached data");
    return;
  }

  if (shouldFetchPosts(state, page)) {
    console.log("🔄 Cache is stale or empty, refreshing posts");
    dispatch(getPosts(page, true)); // Force refresh
  } else {
    console.log("📦 Cache is fresh, no refresh needed");
  }
};
