import Blog from '../models/blog.model.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

export const addImageToBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { imageUrl, prompt = '' } = req.body;

  if (!blogId) {
    throw new AppError('Blog ID is required', 400);
  }

  if (!imageUrl) {
    throw new AppError('Image URL is required', 400);
  }

  const blog = await Blog.findOne({ _id: blogId, userId: req.userId });
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  const image = { url: imageUrl, prompt, source: 'manual' };
  blog.images.push(image);
  await blog.save();

  const savedImage = blog.images[blog.images.length - 1];

  res.status(200).json({
    success: true,
    image: savedImage
  });
});

export const removeImageFromBlog = asyncHandler(async (req, res) => {
  const { blogId, imageId } = req.params;

  if (!blogId || !imageId) {
    throw new AppError('Blog ID and image identifier are required', 400);
  }

  const blog = await Blog.findOne({ _id: blogId, userId: req.userId });
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  const byIndex = parseInt(imageId, 10);
  let removed = false;

  if (!Number.isNaN(byIndex) && byIndex >= 0 && byIndex < blog.images.length) {
    blog.images.splice(byIndex, 1);
    removed = true;
  } else {
    const existing = blog.images.id?.(imageId);
    if (existing) {
      existing.remove();
      removed = true;
    }
  }

  if (!removed) {
    throw new AppError('Image not found', 404);
  }

  await blog.save();

  res.status(200).json({ success: true, message: 'Image removed successfully' });
});
