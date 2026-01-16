import { useState } from 'react';
import { blogAPI } from '../api';

export default function ImageGallery({ blog, onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleRemoveImage = async (index) => {
    if (!confirm('Remove this image?')) return;

    try {
      await blogAPI.removeImageFromBlog(blog.blogId, index);
      const updatedImages = (blog.images || []).filter((_, idx) => idx !== index);
      onUpdate({ ...blog, images: updatedImages });
    } catch (err) {
      console.error('Remove error:', err);
      alert('Failed to remove image');
    }
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      event.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      event.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const response = await blogAPI.addImageToBlog(blog.blogId, dataUrl);
      if (response?.image) {
        const updatedImages = [...(blog.images || []), response.image];
        onUpdate({ ...blog, images: updatedImages });
      } else {
        throw new Error('No image returned from server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert(`Failed to upload image: ${errorMessage}`);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mt-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Blog Images ({blog.images?.length || 0})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {blog.images?.map((image, index) => (
          <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="relative group">
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-4 bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Image</h3>
        <div className="flex gap-3 items-center">
          <label className="cursor-pointer">
            <button
              disabled={uploading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <p className="text-sm text-gray-600">Select an image file to add it to this blog.</p>
        </div>
      </div>
    </div>
  );
}
