# AI Blog Generator

A full-stack web application that leverages AI to generate complete blog posts with images using Hugging Face models. Users can create, edit, export, and manage AI-generated blog content with an intuitive interface.

## 📝 Project Description

AI Blog Generator is a modern web application that automates blog content creation using advanced AI model. It generates comprehensive blog posts based on user-provided topics and preferred writing tones, complete with AI-generated images. The platform includes a rich text editor for content refinement, text regeneration features, and multiple export formats.

## ✨ Key Features

- **🤖 AI-Powered Blog Generation** - Generate complete blog posts using Hugging Face AI models
- **🎨 AI Image Generation** - Automatically generate relevant images for blog content
- **🖼️ Image Upload** - Upload custom images from local directory
- **✏️ Rich Text Editor** - Edit and format blog content with a powerful WYSIWYG editor (Quill)
- **🔄 Text Regeneration** - Rewrite, improve SEO, and change tone of selected text
- **📤 Multiple Export Formats** - Export blogs to PDF, DOCX, and Markdown
- **🔐 User Authentication** - Secure signup/login with JWT-based authentication
- **🎯 Tone Selection** - Choose from multiple writing tones (professional, casual, formal, etc.)


## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS 4** - Utility-first CSS framework
- **Quill/React-Quill** - Rich text editor
- **React Markdown** - Markdown rendering

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB** - NoSQL database (via Mongoose)
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Axios** - HTTP client for AI API calls
- **Hugging Face API** - AI text and image generation
- **Puppeteer** - PDF generation
- **html-to-docx** - DOCX export
- **Turndown** - HTML to Markdown conversion

### DevOps & Tools
- **Docker & Docker Compose** - Containerization and orchestration
- **Nginx** - Frontend web server
- **dotenv** - Environment variable management
- **ESLint** - Code linting

## 📁 File Structure

```
AI-Blog/
├── docker-compose.yml          # Docker Compose configuration
├── README.md                   # Project documentation
│
├── backend/                    # Backend server
│   ├── Dockerfile             # Backend Docker configuration
│   ├── package.json           # Backend dependencies
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   └── src/
│       ├── server.js         # Express server entry point
│       ├── controllers/      # Request handlers
│       │   ├── auth.controller.js
│       │   ├── blog.controller.js
│       │   ├── export.controller.js
│       │   ├── regenerate.controller.js
│       │   └── textRegeneration.controller.js
│       ├── middleware/        # Express middleware
│       │   └── auth.middleware.js
│       ├── models/           # Mongoose schemas
│       │   ├── blog.model.js
│       │   ├── regenerate.model.js
│       │   └── user.model.js
│       ├── routes/           # API routes
│       │   ├── auth.routes.js
│       │   └── blog.routes.js
│       ├── services/         # External services
│       │   └── huggingface.service.js
│       └── utils/            # Utility functions
│           ├── errorHandler.js
│           └── validation.js
│
└── frontend/                  # Frontend application
    ├── Dockerfile            # Frontend Docker configuration
    ├── nginx.conf            # Nginx configuration
    ├── package.json          # Frontend dependencies
    ├── vite.config.js        # Vite configuration
    ├── eslint.config.js      # ESLint configuration
    ├── index.html            # HTML entry point
    └── src/
        ├── main.jsx          # React entry point
        ├── App.jsx           # Main App component
        ├── index.css         # Global styles
        ├── api/              # API client
        │   ├── axios.js
        │   └── index.js
        ├── components/       # React components
        │   ├── BlogEditor.jsx
        │   ├── BlogGenerator.jsx
        │   ├── Editor.jsx
        │   ├── EnhancedBlogGenerator.jsx
        │   ├── Export.jsx
        │   ├── ImageGallery.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── RegenerationComponents.jsx
        │   └── RichTextEditor.jsx
        ├── context/          # React Context
        │   └── AuthContext.jsx
        └── pages/            # Page components
            ├── Dashboard.jsx
            ├── Login.jsx
            └── Signup.jsx
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **Docker & Docker Compose** (for containerized deployment)
- **Hugging Face API Token** (get from [Hugging Face](https://huggingface.co/settings/tokens))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/gitkrypton18/AI-Blog.git
cd AI-Blog
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 🐳 Running with Docker

#### Build and Start All Services

```bash
docker-compose up --build
```

#### Start in Detached Mode

```bash
docker-compose up -d
```

#### Stop Services

```bash
docker-compose down
```

## 👥 Contributors

Created by:
- [Kalpit Nagar](https://github.com/gitkrypton18)
- [Nikhil Nagar](https://github.com/Nikhil-X-codes)




