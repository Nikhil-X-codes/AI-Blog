import { AppError } from './errorHandler.js';


export const validateBlogInput = (topic, tone) => {
  const errors = [];

  if (!topic || typeof topic !== 'string') {
    errors.push('Topic is required and must be a string');
  } else {
    const trimmedTopic = topic.trim();
    if (trimmedTopic.length === 0) {
      errors.push('Topic cannot be empty');
    } else if (trimmedTopic.length < 3) {
      errors.push('Topic must be at least 3 characters long');
    } else if (trimmedTopic.length > 200) {
      errors.push('Topic must not exceed 200 characters');
    }
  }

  const validTones = [
    'professional',
    'fun',
    'concise'
  ];

  if (!tone || typeof tone !== 'string') {
    errors.push('Tone is required and must be a string');
  } else if (!validTones.includes(tone.toLowerCase())) {
    errors.push(`Invalid tone. Must be one of: Professional, Fun, Concise`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRegenerationInput = (blogId, paragraphIndex, tone) => {
  const errors = [];

  if (!blogId) {
    errors.push('Blog ID is required');
  }

  if (paragraphIndex === undefined || paragraphIndex === null) {
    errors.push('Paragraph index is required');
  } else if (!Number.isInteger(paragraphIndex) || paragraphIndex < 0) {
    errors.push('Paragraph index must be a non-negative integer');
  }

  const validTones = [
    'professional',
    'fun',
    'concise'
  ];

  if (tone && !validTones.includes(tone.toLowerCase())) {
    errors.push(`Invalid tone. Must be one of: Professional, Fun, Concise`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') 
    .substring(0, 1000);
};

export const validateInput = (value, { field = 'value', minLength = 1, maxLength = 255 } = {}) => {
  if (value === undefined || value === null) {
    throw new AppError(`${field} is required`, 400);
  }

  if (typeof value !== 'string') {
    throw new AppError(`${field} must be a string`, 400);
  }

  const trimmed = value.trim();

  if (trimmed.length < minLength) {
    throw new AppError(`${field} must be at least ${minLength} characters`, 400);
  }

  if (trimmed.length > maxLength) {
    throw new AppError(`${field} must not exceed ${maxLength} characters`, 400);
  }
};
