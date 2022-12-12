import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unFollowUser } from "../../actions/userAction";

const User = ({ person, id }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [following, setFollowing] = useState(
    person.followers.includes(user._id)
  );
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  const dispatch = useDispatch();
  const handleFollow = (e) => {
    e.preventDefault();
    following
      ? dispatch(unFollowUser(person._id, user))
      : dispatch(followUser(person._id, user));

      setFollowing((prev) => !prev)
  };

  return (
    <div className="follower" key={id}>
      <div>
        <img
          src={
            person.profilePicture
              ? serverPublic + person.profilePicture
              : serverPublic + "defaultProfile.png"
          }
          alt=""
          className="followerImage"
        />
        <div className="name">
          <span>{person.firstname}</span>
          <span>{person.username}</span>
        </div>
      </div>
      <button className="button fc-button" onClick={handleFollow}>
        {following ? "Se désabonner" : "Suivre"}
      </button>
    </div>
  );
};

export default User;
