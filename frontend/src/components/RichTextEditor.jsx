import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { blogAPI } from '../api';

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'fun', label: 'Fun' },
  { value: 'concise', label: 'Concise' }
];

export default function RichTextEditor({ blog, onUpdate, images }) {
  const [content, setContent] = useState(blog.content);
  const [selectedText, setSelectedText] = useState('');
  const [hasSelection, setHasSelection] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSelection = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const selected = content.slice(start, end).trim();

    if (selected.length > 0) {
      setSelectedText(selected);
      setHasSelection(true);
    } else {
      setHasSelection(false);
      setSelectedText('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await blogAPI.updateBlog(blog.blogId, { content });
      onUpdate({ ...blog, content });
      alert('Blog saved successfully!');
    } catch (err) {
      alert('Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleTextAction = async (action, tone = null) => {
    if (!selectedText || selectedText.length < 10) {
      alert('Please select at least 10 characters of text');
      return;
    }

    setProcessing(true);
    setShowToneMenu(false);

    try {
      let response;
      
      switch (action) {
        case 'rewrite':
          response = await blogAPI.rewriteText(blog.blogId, selectedText, blog.tone);
          break;
        case 'improveSEO':
          response = await blogAPI.improveSEO(blog.blogId, selectedText);
          break;
        case 'changeTone':
          response = await blogAPI.changeTone(blog.blogId, selectedText, tone);
          break;
        default:
          throw new Error('Unknown action');
      }

      const newText = response?.data?.data?.regeneratedText ?? response?.data?.regeneratedText;

      if (newText) {
        const updated = content.replace(selectedText, newText);
        setContent(updated);
        onUpdate({ ...blog, content: updated });
      }

    } catch (err) {
      alert('Failed to process text');
    } finally {
      setProcessing(false);
      setShowToneMenu(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Edit Blog</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
          >
            {previewMode ? '✏️ Edit' : '👁️ Preview'}
          </button>
          {hasSelection && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleTextAction('rewrite')}
                disabled={processing}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Working...' : 'Rewrite'}
              </button>
              <button
                onClick={() => handleTextAction('improveSEO')}
                disabled={processing}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Working...' : 'Improve SEO'}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowToneMenu((v) => !v)}
                  disabled={processing}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Working...' : 'Change Tone'}
                </button>
                {showToneMenu && (
                  <div className="absolute right-0 mt-2 bg-white border-2 border-blue-400 rounded-lg shadow-2xl p-4 w-56 z-50">
                    <div className="text-sm font-semibold text-gray-900 mb-3">Select Tone</div>
                    <div className="flex flex-col gap-2">
                      {TONES.map(tone => (
                        <button
                          key={tone.value}
                          onClick={() => handleTextAction('changeTone', tone.value)}
                          disabled={processing}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {tone.label}
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="w-full min-h-[420px] rounded-lg border border-gray-200 p-6 bg-white prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-blue-900 mb-6 pb-3 border-b-2 border-blue-900" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-3" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed text-justify" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
              li: ({ node, ...props }) => <li className="text-gray-700 leading-relaxed" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              hr: ({ node, ...props }) => <hr className="my-6 border-t-2 border-gray-300" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          className="w-full min-h-[420px] rounded-lg border border-gray-300 bg-white text-gray-900 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm placeholder-gray-400"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onSelect={handleSelection}
          placeholder="Write your content here..."
        />
      )}

      {images?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="border border-gray-300 rounded-lg overflow-hidden">
                <img src={img.url} alt={img.alt || 'Blog image'} className="w-full h-24 object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
