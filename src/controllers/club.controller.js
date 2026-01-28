import Post from "../models/Post.model.js";

/* GET POSTS BY CLUB */
export const getClubPosts = async (req, res) => {
  try {
    const club = req.params.club;

    const posts = await Post.find({ club })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* CREATE POST */
export const createClubPost = async (req, res) => {
  try {
    const { content } = req.body;
    const club = req.params.club;

    if (!content) {
      return res.status(400).json({ success: false });
    }

    const post = await Post.create({
      club,
      content,
      user: req.user._id
    });

    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id; // may be undefined

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (userId) {
    if (post.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Already liked" });
    }
    post.likedBy.push(userId);
  }

  post.likes += 1;
  await post.save();

  res.json({ likes: post.likes });
};

