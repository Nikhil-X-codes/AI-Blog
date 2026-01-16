import { useState } from 'react';
import { blogAPI } from '../api';

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'fun', label: 'Fun' },
  { value: 'concise', label: 'Concise' }
];


export default function EnhancedBlogGenerator({ onBlogGenerated }) {
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'professional'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.topic.trim()) {
      errors.topic = 'Topic is required';
    } else if (formData.topic.trim().length < 5) {
      errors.topic = 'Topic must be at least 5 characters';
    } else if (formData.topic.length > 200) {
      errors.topic = 'Topic must not exceed 200 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await blogAPI.generateBlog(
        formData.topic.trim(),
        formData.tone
      );

      // Wait a moment to show completion
      setTimeout(() => {
        onBlogGenerated(response.data);
        
        // Reset form
        setFormData({
          topic: '',
          tone: 'professional'
        });
      }, 500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          'Failed to generate blog. Please try again.';
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    handleGenerate({ preventDefault: () => {} });
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-8 mb-8 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            Generate New Blog
          </h2>
          <p className="text-sm text-gray-400">
            AI-powered blog generation with rich controls
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border-l-4 border-red-600 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-red-300">Generation Failed</h4>
                <p className="text-sm text-red-400 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label 
            htmlFor="blog-topic" 
            className="block text-sm font-semibold text-gray-300 mb-2"
          >
            Blog Topic <span className="text-red-500">*</span>
          </label>
          <input
            id="blog-topic"
            type="text"
            value={formData.topic}
            onChange={(e) => handleInputChange('topic', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              validationErrors.topic ? 'border-red-500 bg-red-900/20' : 'border-gray-700'
            }`}
            placeholder="e.g., The Future of Artificial Intelligence in Healthcare"
            disabled={loading}
            maxLength={200}
            aria-describedby="topic-help topic-error"
            aria-invalid={!!validationErrors.topic}
          />
          <div className="flex justify-between items-center mt-2">
            <p id="topic-help" className="text-xs text-gray-400">
              {validationErrors.topic ? (
                <span id="topic-error" className="text-red-400 font-medium">
                  {validationErrors.topic}
                </span>
              ) : (
                'Enter a descriptive topic for your blog post'
              )}
            </p>
            <span className={`text-xs font-medium ${
              formData.topic.length > 180 ? 'text-red-400' : 'text-gray-500'
            }`}>
              {formData.topic.length}/200
            </span>
          </div>
        </div>

        <div>
          <label 
            htmlFor="blog-tone" 
            className="block text-sm font-semibold text-gray-300 mb-2"
          >
            Writing Tone <span className="text-red-500">*</span>
          </label>
          <select
            id="blog-tone"
            value={formData.tone}
            onChange={(e) => handleInputChange('tone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
            aria-describedby="tone-description"
          >
            {TONES.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {tone.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.topic.trim() || Object.keys(validationErrors).length > 0}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        >
          {loading ? 'Generating Your Blog...' : 'Generate Blog with AI'}
        </button>

      </form>
    </div>
  );
}
