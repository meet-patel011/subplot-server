import Comment from "../models/Comment.model.js";

export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false });
    }

    const comment = await Comment.create({
      post: req.params.postId,
      user: req.user._id,
      content,
    });

    res.status(201).json({ success: true, comment });
  } catch (err) {
    next(err);
  }
};

export const getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    next(err);
  }
};
