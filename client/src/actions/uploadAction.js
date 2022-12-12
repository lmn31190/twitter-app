import * as UploadApi from '../api/UploadRequest'

export const uploadImage = (data) => async (dispatch) => {
  try {
    await UploadApi.uploadImage(data);
  } catch (err) {
    // console.log(err);
  }
};

export const uploadPost = (data) => async (dispatch) => {
  dispatch({type: "UPLOAD_START"})
  try {
    const newPost = await UploadApi.uploadPost(data);
    dispatch({type: "UPLOAD_SUCCESS", data: newPost.data})
  } catch (err) {
    console.log(err);
    dispatch({type: "UPLOAD_FAIL"})
  }
}