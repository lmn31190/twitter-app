import React, { useState, useRef } from "react";
import "./postShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../actions/uploadAction";

const PostShare = () => {
  const loading = useSelector((state) => state.postReducer.uploading);
  const [image, setImage] = useState(null);
  const { user } = useSelector((state) => state.authReducer.authData);
  const desc = useRef();
  const imageRef = useRef();
  const dispatch = useDispatch();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setImage(img);
    }
  };

  const reset = () => {
    setImage(null);
    desc.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    if (image) {
      const data = new FormData();
      const filenname = Date.now() + image.name;
      data.append("name", filenname);
      data.append("file", image);
      newPost.image = filenname;
      console.log(newPost);

      try {
        dispatch(uploadImage(data));
      } catch (err) {
        console.log(err);
      }
    }
    dispatch(uploadPost(newPost));
    reset();
  };

  return (
    <div className="PostShare">
      <img src={user.profilePicture ? serverPublic + user.profilePicture : serverPublic + "defaultprofile.png"} alt="" />
      <div>
        <input type="text" placeholder="Quoi de neuf ?" ref={desc} required />
        <div className="postOptions">
          <div
            className="option"
            style={{ color: "var(--photo)" }}
            onClick={() => imageRef.current.click()}
          >
            <UilScenery />
            Photo
          </div>
          <div className="option" style={{ color: "var(--video)" }}>
            <UilPlayCircle />
            Video
          </div>{" "}
          <div className="option" style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            Lieu
          </div>{" "}
          <div className="option" style={{ color: "var(--shedule)" }}>
            <UilSchedule />
            Programme
          </div>
          <button
            className="button ps-button"
            onClick={handleSubmit}
          >
            Partager
          </button>
          <div style={{ display: "none" }}>
            <input
              type="file"
              name="myImage"
              ref={imageRef}
              onChange={onImageChange}
            />
          </div>
        </div>
        {image && (
          <div className="previewImage">
            <UilTimes style={{color: 'white'}} onClick={() => setImage(null)} />
            <img src={URL.createObjectURL(image)} alt="img-upload" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
