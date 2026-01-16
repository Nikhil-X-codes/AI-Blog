import Blog from '../models/blog.model.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

export const addImageToBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { imageUrl } = req.body;

  console.log('addImageToBlog called:', { blogId, hasImageUrl: !!imageUrl, imageUrlLength: imageUrl?.length });

  if (!blogId) {
    throw new AppError('Blog ID is required', 400);
  }

  if (!imageUrl) {
    throw new AppError('Image URL is required', 400);
  }

  // Validate that it's either a data URL or a regular URL
  const isDataUrl = imageUrl.startsWith('data:image/');
  const isHttpUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
  
  if (!isDataUrl && !isHttpUrl) {
    throw new AppError('Invalid image URL format. Must be a data URL or HTTP(S) URL', 400);
  }

  const blog = await Blog.findOne({ _id: blogId, userId: req.userId });
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  // Ensure images array exists
  if (!blog.images) {
    blog.images = [];
  }

  const image = { url: imageUrl, source: 'manual' };
  blog.images.push(image);
  await blog.save();

  const savedImage = blog.images[blog.images.length - 1];

  console.log('Image added successfully:', { imageId: savedImage._id, totalImages: blog.images.length });

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
