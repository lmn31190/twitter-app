import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import mongoose from "mongoose";

// Create_Post

export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET_Post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json("Le post n'existe pas !");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE_Post

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);

    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post mis à jour !");
    } else {
      res.status(403).json("Vous n'êtes pas autorisé !");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);

    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post supprimé !");
    } else {
      res.status(403).json("Vous n'êtes pas autorisé !");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// LIKE-DISLIKE_Post

export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liké");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post Unliké");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET-TIMELINE_Post

export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        })
    );
  } catch (err) {
    res.status(500).json(err);
  }
};
