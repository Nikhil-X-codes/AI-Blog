import { useState } from 'react';
import Editor from './Editor';
import Export from './Export';


export default function BlogEditor({ blog, onUpdate, images = [] }) {
  const [currentContent, setCurrentContent] = useState(blog.content);
  const [activeTab, setActiveTab] = useState('edit');

  const handleContentUpdate = (updatedBlog) => {
    setCurrentContent(updatedBlog.content);
    onUpdate?.(updatedBlog);
  };

  const handleSave = (savedBlog) => {
    setCurrentContent(savedBlog.content);
    onUpdate?.(savedBlog);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'export' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          📥 Export
        </button>
      </div>

      {activeTab === 'edit' && (
        <Editor
          blog={blog}
          onUpdate={handleContentUpdate}
          onSave={handleSave}
          images={images}
        />
      )}

      {activeTab === 'export' && (
        <Export
          blog={blog}
          editorContent={currentContent}
        />
      )}
    </div>
  );
}
