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
} from "../constants/actionTypes";

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

export const getPosts = (page) => async (dispatch) => {
  try {
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

export const createPost = (post, navigate) => async (dispatch) => {
  try {
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
    if (postId) {
      navigate(`/posts/${postId}`);
    }
    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.error("Create post error:", error.response?.data || error.message);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    console.log("🔍 updatePost action - id:", id, "type:", typeof id);
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.error("Update post error:", error.response?.data || error.message);
  }
};

export const deletePost = (id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const response = await api.deletePost(id);

    if (response.status === 200) {
      dispatch({ type: DELETE, payload: id });

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

    dispatch({ type: LIKE, payload: data });
    console.log("🟡 LIKE action dispatched with payload:", data);
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

    dispatch({ type: COMMENT, payload: data });
    return data.comments || data.comment || [];
  } catch (error) {
    console.error("Comment post error:", error.response?.data || error.message);
    throw error; // Re-throw to allow component to handle it
  }
};
