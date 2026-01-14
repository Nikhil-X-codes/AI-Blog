import { useState } from 'react';
import { blogAPI } from '../api';
import Button from '../pages/Button';

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'fun', label: 'Fun' },
  { value: 'concise', label: 'Concise' }
];

export default function BlogGenerator({ onBlogGenerated }) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Request Markdown format for proper formatting in exports and preview
      const response = await blogAPI.generateBlog(topic, tone, '', 'markdown');
      if (response?.data) {
        onBlogGenerated(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Generate New Blog
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            placeholder="e.g., The Future of Artificial Intelligence"
            disabled={loading}
            maxLength={200}
          />
          <p className="mt-1 text-sm text-gray-600">
            {topic.length}/200 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Writing Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            {TONES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading || !topic.trim()}
          loading={loading}
          className="w-full"
        >
          {loading ? 'Generating Blog... (This may take up to 2 minutes)' : 'Generate Blog'}
        </Button>
      </form>
    </div>
  );
}
