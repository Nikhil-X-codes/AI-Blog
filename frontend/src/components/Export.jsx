import { useState } from 'react';
import { blogAPI } from '../api';
import Button from '../pages/Button';


export default function Export({ blog, editorContent }) {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);
  const [error, setError] = useState('');

  const handleExport = async (format) => {
    setExporting(true);
    setError('');
    setExportFormat(format);

    try {
      const payload = {
        content: editorContent,
        title: blog.title,
        blogId: blog.blogId,
        images: (blog?.images || []).map((img, index) => ({
          url: img.url,
          alt: img.alt || `Image ${index + 1}`
        }))
      };

      let response;

      switch (format) {
        case 'pdf':
          response = await blogAPI.exportToPDF(payload);
          break;
        case 'docx':
          response = await blogAPI.exportToDOCX(payload);
          break;
        default:
          throw new Error('Unknown export format');
      }

      if (response.data) {
        downloadFile(response.data, format);
      }
    } catch (err) {
      setError(`Failed to export as ${format.toUpperCase()}: ${err.response?.data?.message || err.message}`);
      console.error('Export error:', err);
    } finally {
      setExporting(false);
      setExportFormat(null);
    }
  };

  const downloadFile = (data, format) => {
    let blob;
    let filename;

    const mimeTypes = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    const extensions = {
      pdf: 'pdf',
      docx: 'docx'
    };

    if (data instanceof Blob) {
      blob = data;
    } else if (typeof data === 'string') {
      blob = new Blob([data], { type: mimeTypes[format] || 'text/plain' });
    } else if (data.file) {
      blob = new Blob([data.file], { type: mimeTypes[format] || 'text/plain' });
    } else {
      throw new Error('Invalid file data format');
    }

    filename = `${blog.title || 'blog'}.${extensions[format]}`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportOptions = [
    { format: 'pdf', label: 'PDF', icon: '📄', color: 'red' },
    { format: 'docx', label: 'Word (DOCX)', icon: '📝', color: 'blue' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Export Blog</h3>
        <p className="text-sm text-gray-600">Download as PDF or DOCX with images embedded.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        {exportOptions.map((option) => (
          <Button
            key={option.format}
            onClick={() => handleExport(option.format)}
            disabled={exporting}
            loading={exporting && exportFormat === option.format}
          >
            <span>{option.icon} {option.label}</span>
          </Button>
        ))}
      </div>

    </div>
  );
}
