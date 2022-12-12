import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET_All_User

export const getAllUser = async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET_User

export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("Aucun utilisateur existe !");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE_User

export const updateUser = async (req, res) => {
  const id = req.params.id;

  const { _id, currentUserAdminStatus, password } = req.body;

  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({ user, token });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res
      .status(403)
      .json("Accès refusé, vous ne pouvez modifier que votre profile !");
  }
};

// DELETE_User

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("L'utilisateur à bien été supprimé !");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res
      .status(403)
      .json("Accès refusé, vous ne pouvez supprimer que votre profile !");
  }
};

// FOLLOW_User

export const followUser = async (req, res) => {
  const id = req.params.id;

  const { _id } = req.body;

  if (_id === id) {
    res.status(403).json("Action interdite");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("Abonnée !");
      } else {
        res.status(403).json("Vous suivez déja cet utilisateur !");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

// UNFOLLOW_User

export const unFollowUser = async (req, res) => {
  const id = req.params.id;

  const { _id } = req.body;

  if (_id === id) {
    res.status(403).json("Action interdite");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (followUser.followers.includes(_id)) {
        await followUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("Désabonnée !");
      } else {
        res.status(403).json("Vous ne suivez pas cet utilisateur !");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
