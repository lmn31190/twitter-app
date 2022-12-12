import * as PostsApi from "../api/PostRequest";

export const getTimeLinePosts = (id) => async (dispatch) => {
  dispatch({ type: "RETREIVING_START" });

  try {
    const { data } = await PostsApi.getTimeLinePosts(id);
    dispatch({ type: "RETREIVING_SUCCESS", data: data });
  } catch (err) {
    dispatch({ type: "RETREIVING_FAILED" });
    console.log(err);
  }
};
