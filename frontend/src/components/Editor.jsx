import { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { blogAPI } from '../api';
import Button from '../pages/Button';

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'fun', label: 'Fun' },
  { value: 'concise', label: 'Concise' }
];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean']
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'script',
  'blockquote', 'code-block',
  'link', 'image'
];

export default function Editor({ 
  blog, 
  onUpdate, 
  images = [],
  onSave 
}) {
  const quillRef = useRef(null);
  const [content, setContent] = useState(blog?.content || '');
  const [selectedText, setSelectedText] = useState('');
  const [hasSelection, setHasSelection] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showTonePicker, setShowTonePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSelectionChange = (range, oldRange, source) => {
    if (!range) {
      setHasSelection(false);
      setSelectedText('');
      return;
    }

    // Check if there's actual selection (range.length > 0)
    if (range.length > 0) {
      try {
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        // Get selected text using getText with proper range
        const text = editor.getText(range.index, range.length);
        const trimmedText = text.trim();

        if (trimmedText.length > 0) {
          setSelectedText(trimmedText);
          setHasSelection(true);
        } else {
          setHasSelection(false);
          setSelectedText('');
        }
      } catch (error) {
        console.error('Selection error:', error);
        setHasSelection(false);
        setSelectedText('');
      }
    } else {
      setHasSelection(false);
      setSelectedText('');
    }
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    onUpdate?.({ ...blog, content: newContent });
  };

  const handleRegenerateText = async (action, tone = null) => {
    if (!selectedText || selectedText.length < 3) {
      alert('Please select at least 3 characters of text');
      return;
    }

    setProcessing(true);
    setShowTonePicker(false);

    try {
      // Simulate API call - replace with your actual API
      let regeneratedText = '';
      
      switch (action) {
        case 'rewrite':
          regeneratedText = `[Rewritten] ${selectedText}`;
          break;
        case 'improveSEO':
          regeneratedText = `[SEO Improved] ${selectedText}`;
          break;
        case 'changeTone':
          regeneratedText = `[${tone}] ${selectedText}`;
          break;
        default:
          throw new Error('Unknown action');
      }

      // Replace selected text with regenerated text
      if (regeneratedText) {
        const updated = content.replace(selectedText, regeneratedText);
        setContent(updated);
        onUpdate?.({ ...blog, content: updated });
        setSelectedText('');
        setHasSelection(false);
        setShowTonePicker(false);
      }
    } catch (err) {
      alert('Failed to regenerate text: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleInsertImage = (imageUrl) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();
      if (range) {
        editor.insertEmbed(range.index, 'image', imageUrl);
        editor.setSelection(range.index + 1);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Replace with your actual API call
      onSave?.({ ...blog, content });
      alert('Blog saved successfully!');
    } catch (err) {
      alert('Failed to save blog: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Helper text */}
      {!hasSelection && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 font-medium">
                💡 Tip: Select any text in the editor below to see Rewrite, Improve SEO, and Change Tone options
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{blog?.title || 'Blog Editor'}</h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {hasSelection && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 rounded-lg border-2 border-blue-300 shadow-2xl animate-pulse">
              <span className="text-white font-semibold text-sm">✨ Text Selected</span>
              <div className="w-px h-6 bg-blue-200"></div>
              <button
                onClick={() => handleRegenerateText('rewrite')}
                disabled={processing}
                className="px-3 py-1 bg-white text-blue-600 rounded font-semibold text-sm hover:bg-blue-50 disabled:opacity-50"
              >
                {processing ? '⏳' : '🔄'} Rewrite
              </button>
              <div className="w-px h-6 bg-blue-200"></div>
              <button
                onClick={() => handleRegenerateText('improveSEO')}
                disabled={processing}
                className="px-3 py-1 bg-white text-blue-600 rounded font-semibold text-sm hover:bg-blue-50 disabled:opacity-50"
              >
                {processing ? '⏳' : '🔍'} Improve SEO
              </button>
              <div className="w-px h-6 bg-blue-200"></div>
              <div className="relative">
                <button
                  onClick={() => setShowTonePicker((v) => !v)}
                  disabled={processing}
                  className="px-3 py-1 bg-white text-blue-600 rounded font-semibold text-sm hover:bg-blue-50 disabled:opacity-50"
                >
                  {processing ? '⏳' : '🎨'} Change Tone
                </button>
                {showTonePicker && (
                  <div className="absolute right-0 mt-2 bg-white border-2 border-blue-400 rounded-lg shadow-2xl p-4 w-48 z-50">
                    <div className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Select Tone</div>
                    <div className="grid grid-cols-1 gap-2">
                      {TONES.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => handleRegenerateText('changeTone', t.value)}
                          disabled={processing}
                          className="px-3 py-2 bg-gray-100 text-gray-800 rounded font-semibold text-sm hover:bg-gray-200 disabled:opacity-50"
                        >
                          {processing ? '⏳ ' : ''}{t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-lg">
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={handleContentChange}
          onChangeSelection={handleSelectionChange}
          modules={modules}
          formats={formats}
          theme="snow"
          placeholder="Start editing your blog..."
          className="quill-editor"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Image Gallery */}
      {images?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Click image to insert
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleInsertImage(img.url)}
                className="relative group border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition p-0">
                <img
                  src={img.url}
                  alt={img.alt || 'Blog image'}
                  className="w-full h-24 object-cover group-hover:opacity-75 transition"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                  <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.quill-editor),
        :global(.ql-toolbar),
        :global(.ql-container),
        :global(.ql-editor) {
          background-color: #ffffff !important;
          color: #0f172a !important;
        }

        :global(.ql-toolbar) {
          border-color: #d1d5db !important;
          background: #f9fafb !important;
        }

        :global(.ql-toolbar .ql-stroke) {
          stroke: #1f2937 !important;
        }

        :global(.ql-toolbar .ql-fill) {
          fill: #1f2937 !important;
        }

        :global(.ql-toolbar .ql-picker) {
          color: #1f2937 !important;
        }

        :global(.ql-toolbar button:hover),
        :global(.ql-toolbar button.ql-active) {
          color: #3b82f6 !important;
        }

        :global(.ql-toolbar button:hover .ql-stroke),
        :global(.ql-toolbar button.ql-active .ql-stroke) {
          stroke: #3b82f6 !important;
        }

        :global(.ql-toolbar button:hover .ql-fill),
        :global(.ql-toolbar button.ql-active .ql-fill) {
          fill: #3b82f6 !important;
        }

        :global(.ql-container) {
          border-color: #d1d5db !important;
          background: #ffffff !important;
        }

        :global(.ql-editor) {
          min-height: 400px;
          padding: 20px;
          font-size: 16px;
          line-height: 1.7;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: #0f172a !important;
        }

        :global(.ql-editor h1),
        :global(.ql-editor h2),
        :global(.ql-editor h3),
        :global(.ql-editor h4),
        :global(.ql-editor h5),
        :global(.ql-editor h6) {
          color: #0f172a !important;
          font-weight: 700 !important;
        }

        :global(.ql-editor p),
        :global(.ql-editor li),
        :global(.ql-editor ol),
        :global(.ql-editor ul) {
          color: #1f2937 !important;
        }

        :global(.ql-editor a) {
          color: #2563eb !important;
          text-decoration: underline;
        }

        :global(.ql-editor blockquote) {
          border-left: 4px solid #3b82f6;
          padding-left: 16px;
          color: #4b5563 !important;
          font-style: italic;
        }

        :global(.ql-editor pre),
        :global(.ql-editor code) {
          background: #f3f4f6 !important;
          color: #1f2937 !important;
          border-radius: 6px;
          padding: 12px;
        }

        :global(.ql-editor ::selection) {
          background: #3b82f6 !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}