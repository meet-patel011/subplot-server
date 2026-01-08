import Post from "../models/Post.model.js";

export const createPost = async (req, res, next) => {
  try {
    const { content, media } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: "Content required" });
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      media,
    });

    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false });

    const index = post.likes.indexOf(req.user._id);
    if (index === -1) post.likes.push(req.user._id);
    else post.likes.splice(index, 1);

    await post.save();
    res.json({ success: true, likes: post.likes.length });
  } catch (err) {
    next(err);
  }
};
