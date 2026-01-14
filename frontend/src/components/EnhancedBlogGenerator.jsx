import { useState } from 'react';
import { blogAPI } from '../api';
import Button from '../pages/Button';

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'fun', label: 'Fun' },
  { value: 'concise', label: 'Concise' }
];


export default function EnhancedBlogGenerator({ onBlogGenerated }) {
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'professional',
    keywords: ''
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.topic.trim()) {
      errors.topic = 'Topic is required';
    } else if (formData.topic.trim().length < 5) {
      errors.topic = 'Topic must be at least 5 characters';
    } else if (formData.topic.length > 200) {
      errors.topic = 'Topic must not exceed 200 characters';
    }

    if (formData.keywords && formData.keywords.length > 500) {
      errors.keywords = 'Keywords must not exceed 500 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Simulate progress for better UX
  const simulateProgress = () => {
    let currentProgress = 0;
    const messages = [
      { progress: 0, message: 'Initializing AI models...' },
      { progress: 20, message: 'Analyzing topic and context...' },
      { progress: 40, message: 'Generating blog content...' },
      { progress: 60, message: 'Optimizing writing style...' },
      { progress: 80, message: 'Creating relevant images...' },
      { progress: 90, message: 'Finalizing your blog...' }
    ];

    const interval = setInterval(() => {
      currentProgress += 1;
      const currentMessage = messages.find(m => currentProgress >= m.progress && currentProgress < m.progress + 20);
      
      if (currentMessage) {
        setProgressMessage(currentMessage.message);
      }
      
      setProgress(Math.min(currentProgress, 95));

      if (currentProgress >= 95) {
        clearInterval(interval);
      }
    }, 1500);

    return interval;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
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
    setProgress(0);
    setProgressMessage('Starting generation...');

    const progressInterval = simulateProgress();

    try {
      const response = await blogAPI.generateBlog(
        formData.topic.trim(),
        formData.tone,
        formData.keywords.trim()
      );

      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage('Blog generated successfully!');

      // Wait a moment to show completion
      setTimeout(() => {
        onBlogGenerated(response.data);
        
        // Reset form
        setFormData({
          topic: '',
          tone: 'professional',
          keywords: ''
        });
        setProgress(0);
        setProgressMessage('');
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setProgressMessage('');
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          'Failed to generate blog. Please try again.';
      
      setError(errorMessage);
      
      // Log error for debugging (remove in production or use proper logging service)
      console.error('Blog generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    handleGenerate({ preventDefault: () => {} });
  };

  const selectedTone = TONES.find(t => t.value === formData.tone);

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

      {/* Error Display with Retry */}
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
            <Button
              onClick={handleRetry}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {loading && (
        <div className="mb-6 p-5 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">
              {progressMessage}
            </span>
            <span className="text-sm font-bold text-blue-400">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="w-full h-full opacity-50 bg-white animate-pulse"></div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            This may take 1-2 minutes depending on content complexity
          </p>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Topic Input */}
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

        {/* Tone Selection */}
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
          {selectedTone && (
            <p id="tone-description" className="text-xs text-gray-400 mt-2">
              {selectedTone.description}
            </p>
          )}
        </div>

        {/* Keywords (Optional) */}
        <div>
          <label 
            htmlFor="blog-keywords" 
            className="block text-sm font-semibold text-gray-300 mb-2"
          >
            Keywords (Optional)
          </label>
          <input
            id="blog-keywords"
            type="text"
            value={formData.keywords}
            onChange={(e) => handleInputChange('keywords', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.keywords ? 'border-red-500 bg-red-900/20' : 'border-gray-700'
            }`}
            placeholder="e.g., AI, machine learning, technology, healthcare"
            disabled={loading}
            maxLength={500}
            aria-describedby="keywords-help"
          />
          <p id="keywords-help" className="text-xs text-gray-400 mt-2">
            {validationErrors.keywords ? (
              <span className="text-red-400 font-medium">{validationErrors.keywords}</span>
            ) : (
              'Comma-separated keywords to guide content generation (improves SEO)'
            )}
          </p>
        </div>

        {/* Generate Button */}
        <Button
          type="submit"
          disabled={loading || !formData.topic.trim() || Object.keys(validationErrors).length > 0}
          loading={loading}
          className="w-full"
        >
          {loading ? 'Generating Your Blog...' : 'Generate Blog with AI'}
        </Button>

        {/* Info Box */}
        {!loading && (
          <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-blue-300 mb-1">AI-Powered Generation</p>
                <p className="text-blue-200">
                  Our AI will create a comprehensive blog post with relevant images. 
                  You can edit, regenerate sections, and export in multiple formats after generation.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
