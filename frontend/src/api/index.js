import api from './axios';

export const authAPI = {
  signup: async (email, password, name) => {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }
};

export const blogAPI = {
  generateBlog: async (topic, tone, format) => {
    const payload = { topic, tone };
    if (format) payload.format = format;
    const response = await api.post('/blog/generate', payload);
    return response.data;
  },

  getAllBlogs: async (page = 1, limit = 10) => {
    const response = await api.get('/blog', { params: { page, limit } });
    return response.data;
  },

  getBlog: async (blogId) => {
    const response = await api.get(`/blog/${blogId}`);
    return response.data;
  },

  updateBlog: async (blogId, data) => {
    const response = await api.put(`/blog/${blogId}`, data);
    return response.data;
  },

  deleteBlog: async (blogId) => {
    const response = await api.delete(`/blog/${blogId}`);
    return response.data;
  },

  rewriteText: async (blogId, selectedText, tone = 'professional') => {
    const response = await api.post(`/blog/${blogId}/text/rewrite`, {
      selectedText,
      tone
    });
    return response.data;
  },

  improveSEO: async (blogId, selectedText) => {
    const response = await api.post(`/blog/${blogId}/text/improve-seo`, {
      selectedText
    });
    return response.data;
  },

  changeTone: async (blogId, selectedText, newTone) => {
    const response = await api.post(`/blog/${blogId}/text/change-tone`, {
      selectedText,
      newTone
    });
    return response.data;
  },

  addImageToBlog: async (blogId, imageUrl, prompt) => {
    const response = await api.post(`/blog/${blogId}/images`, {
      imageUrl,
      prompt
    });
    return response.data;
  },

  removeImageFromBlog: async (blogId, imageId) => {
    const response = await api.delete(`/blog/${blogId}/images/${imageId}`);
    return response.data;
  },

  exportToPDF: async (payload) => {
    const response = await api.post('/blog/export/pdf', payload, {
      responseType: 'blob'
    });
    return response;
  },

  exportToDOCX: async (payload) => {
    const response = await api.post('/blog/export/docx', payload, {
      responseType: 'blob'
    });
    return response;
  },

  exportBlog: async (blogId, format = 'markdown', fileName = null) => {
    const response = await api.post(`/blog/${blogId}/export`, {
      format,
      fileName
    });
    return response.data;
  },

  previewExport: async (blogId, format) => {
    const response = await api.get(`/blog/${blogId}/export/preview/${format}`);
    return response.data;
  }
};

export default { authAPI, blogAPI };
