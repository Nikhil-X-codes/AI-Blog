import express from 'express';
import {
  generateCompleteBlog,
  getBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog
} from '../controllers/blog.controller.js';
import {
  rewriteText,
  improveSEO,
  changeTone
} from '../controllers/textRegeneration.controller.js';
import {
  addImageToBlog,
  removeImageFromBlog,
} from '../controllers/regenerate.controller.js';
import { exportToDOCXFile, exportToPDFFile } from '../controllers/export.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/export/pdf', protect, exportToPDFFile);
router.post('/export/docx', protect, exportToDOCXFile);

router.post('/generate', protect, generateCompleteBlog);
router.get('/', protect, getAllBlogs);
router.get('/:blogId', protect, getBlog);
router.put('/:blogId', protect, updateBlog);
router.delete('/:blogId', protect, deleteBlog);

router.post('/:blogId/text/rewrite', protect, rewriteText);
router.post('/:blogId/text/improve-seo', protect, improveSEO);
router.post('/:blogId/text/change-tone', protect, changeTone);

router.post('/:blogId/images', protect, addImageToBlog);
router.delete('/:blogId/images/:imageId', protect, removeImageFromBlog);


export default router;
