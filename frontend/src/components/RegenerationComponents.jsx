import { useState } from 'react';
import { blogAPI } from '../api';
import Button from '../pages/Button';

const REGENERATION_ACTIONS = [
  {
    id: 'rewrite',
    label: 'Rewrite',
    icon: '🔄',
    description: 'Generate alternative phrasing',
    color: 'blue'
  },
  {
    id: 'improve-seo',
    label: 'Improve SEO',
    icon: '🔍',
    description: 'Optimize for search engines',
    color: 'green'
  },
  {
    id: 'change-tone',
    label: 'Change Tone',
    icon: '🎨',
    description: 'Switch writing style',
    color: 'pink'
  }
];

const TONES = [
  'professional',
  'fun',
  'concise'
];


export function TextRegenerationToolbar({ 
  selectedText,
  position,
  blogId,
  onRegeneratedText,
  onClose
}) {
  const [loading, setLoading] = useState(false);
  const [showTonePicker, setShowTonePicker] = useState(false);

  const handleAction = async (action) => {
    if (!selectedText || loading) return;

    setLoading(true);

    try {
      let response;

      switch (action) {
        case 'rewrite':
          response = await blogAPI.rewriteText(blogId, selectedText);
          break;
        case 'improve-seo':
          response = await blogAPI.improveSEO(blogId, selectedText);
          break;
        case 'change-tone':
          setShowTonePicker(true);
          setLoading(false);
          return;
        default:
          throw new Error('Unknown action');
      }

      if (response?.data?.regeneratedText) {
        onRegeneratedText(response.data.regeneratedText);
      }

    } catch (error) {
      console.error('Regeneration error:', error);
      alert('Failed to regenerate text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTone = async (newTone) => {
    setLoading(true);
    setShowTonePicker(false);

    try {
      const response = await blogAPI.changeTone(blogId, selectedText, newTone);
      
      if (response?.data?.regeneratedText) {
        onRegeneratedText(response.data.regeneratedText);
      }

    } catch (error) {
      console.error('Tone change error:', error);
      alert('Failed to change tone. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedText) return null;

  return (
    <div
      className="fixed bg-gray-900 rounded-lg shadow-2xl border-2 border-blue-500 z-50 p-3"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)'
      }}
    >
      {showTonePicker ? (
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-white">Select Tone</h4>
            <Button
              onClick={() => setShowTonePicker(false)}
            >
              ✕
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TONES.map((tone) => (
              <Button
                key={tone}
                onClick={() => handleChangeTone(tone)}
                disabled={loading}
              >
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {REGENERATION_ACTIONS.map((action) => (
            <Button
              key={action.id}
              onClick={() => handleAction(action.id)}
              disabled={loading}
            >
              <span className="mr-1">{action.icon}</span>
              {action.label}
            </Button>
          ))}
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <Button
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-90 rounded-lg flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default TextRegenerationToolbar;
