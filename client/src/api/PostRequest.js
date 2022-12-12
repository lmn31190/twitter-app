import axios from "axios";

const API = axios.create({ baseURL: "https://twitter-app.herokuapp.com/" });

export const getTimeLinePosts = (id) => API.get(`/post/${id}/timeline`)
export const likePost = (id, userId) => API.put(`post/${id}/like`, {userId: userId})