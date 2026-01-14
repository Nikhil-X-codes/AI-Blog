import { useState } from 'react';
import Editor from './Editor';
import Export from './Export';
import Button from '../pages/Button';


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
        <Button
          onClick={() => setActiveTab('edit')}
          className={activeTab === 'edit' ? 'border-blue-500 text-blue-400' : 'text-gray-400'}
        >
          ✏️ Edit
        </Button>
        <Button
          onClick={() => setActiveTab('export')}
          className={activeTab === 'export' ? 'border-blue-500 text-blue-400' : 'text-gray-400'}
        >
          📥 Export
        </Button>
      </div>

      {/* Tab Content */}
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
