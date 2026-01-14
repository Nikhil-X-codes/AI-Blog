import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BlogGenerator from '../components/BlogGenerator';
import RichTextEditor from '../components/RichTextEditor';
import ImageGallery from '../components/ImageGallery';
import Export from '../components/Export';
import Button from './Button';

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
                <Button
                  onClick={() => setShowImageGallery(!showImageGallery)}
                  className={showImageGallery ? 'bg-blue-600 text-white' : ''}
                >
                  {showImageGallery ? 'Hide' : 'Manage'} Images
                </Button>
                <Button
                  onClick={handleNewBlog}
                >
                  New Blog
                </Button>
              </>
            )}
            <Button
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentBlog ? (
          <BlogGenerator onBlogGenerated={handleBlogGenerated} />
        ) : (
          <div className="space-y-6">
            {/* Rich Text Editor with Image Sidebar */}
            <RichTextEditor 
              blog={currentBlog} 
              onUpdate={handleBlogUpdate}
              images={currentBlog.images}
            />

            {/* Export options */}
            <Export blog={currentBlog} editorContent={currentBlog?.content} />

            {/* Separate Image Gallery (optional, can be toggled) */}
            {showImageGallery && (
              <ImageGallery blog={currentBlog} onUpdate={handleBlogUpdate} />
            )}

            {/* Removed instructions panel as requested */}
          </div>
        )}
      </main>
    </div>
  );
}
