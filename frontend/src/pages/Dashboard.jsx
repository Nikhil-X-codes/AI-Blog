import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BlogGenerator from '../components/BlogGenerator';
import RichTextEditor from '../components/RichTextEditor';
import ImageGallery from '../components/ImageGallery';
import Export from '../components/Export';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentBlog, setCurrentBlog] = useState(null);
  const [showImageGallery, setShowImageGallery] = useState(false);

  const handleBlogGenerated = (blogData) => {
    setCurrentBlog(blogData);
    setShowImageGallery(false);
  };

  const handleBlogUpdate = (updatedBlog) => {
    setCurrentBlog(updatedBlog);
  };

  const handleNewBlog = () => {
    if (confirm('Start a new blog? Current changes will be lost.')) {
      setCurrentBlog(null);
      setShowImageGallery(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Blog Generator</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name || user?.email}</p>
          </div>
          <div className="flex gap-3">
            {currentBlog && (
              <>
                <button
                  onClick={() => setShowImageGallery(!showImageGallery)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${showImageGallery ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {showImageGallery ? 'Hide' : 'Manage'} Images
                </button>
                <button
                  onClick={handleNewBlog}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                >
                  New Blog
                </button>
              </>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentBlog ? (
          <BlogGenerator onBlogGenerated={handleBlogGenerated} />
        ) : (
          <div className="space-y-6">
            <RichTextEditor 
              blog={currentBlog} 
              onUpdate={handleBlogUpdate}
              images={currentBlog.images}
            />

            <Export blog={currentBlog} editorContent={currentBlog?.content} />

            {showImageGallery && (
              <ImageGallery blog={currentBlog} onUpdate={handleBlogUpdate} />
            )}

          </div>
        )}
      </main>
    </div>
  );
}
