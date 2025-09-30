import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 300000, // 5 minutes timeout
});

// const API = axios.create({
//   baseURL:  "http://localhost:5000"
// });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${
      searchQuery.tags
    }`
  );

export const createPost = (newPost) => API.post("/posts", newPost);
export const likePost = (id) => {
  console.log("🟢 API likePost called with id:", id);
  console.log("🟢 API base URL:", API.defaults.baseURL);
  console.log("🟢 API headers:", API.defaults.headers);
  return API.patch(`/posts/${id}/likePost`);
};
export const comment = (value, id) =>
  API.patch(`/posts/${id}/commentPost`, { value });

export const updatePost = (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
export const googleSignIn = (userData) =>
  API.post("/user/googleSignIn", userData);
