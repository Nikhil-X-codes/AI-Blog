import { useState } from 'react';
import { blogAPI } from '../api';

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
    <div className="relative bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Waves */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
          <svg className="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path className="animate-wave" fill="#3b82f6" fillOpacity="0.4" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="absolute bottom-0 w-full h-full animation-delay-2000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path className="animate-wave" fill="#8b5cf6" fillOpacity="0.3" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Rotating Geometric Shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-blue-200 rounded-lg opacity-20 animate-spin-slow"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 border-4 border-purple-200 rounded-full opacity-20 animate-spin-slow animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-indigo-200 opacity-20 animate-bounce-slow"></div>
        
        {/* Gradient Orbs with Scale Animation */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 animate-scale-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full opacity-25 animate-scale-pulse animation-delay-2000"></div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-900 relative z-10">
        Generate New Blog
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg relative z-10">
          {error}
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
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

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating Blog... (This may take up to 2 minutes)' : 'Generate Blog'}
        </button>
      </form>
    </div>
  );
}
