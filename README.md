## Steps to Run the Project

1. **Install Dependencies**  
   ```bash
   npm install

2. **Run frontend**  
   ```bash
   npm run dev

### Steps to Run Project
## Steps to Run the Project

3. **Run Backend**  
   ```bash
   npm run dev

###Login Credentails
**Email** - amarjeetchoudhary6@gmail.com
**Password** - Manish@786

-  ** Run Backend ** - npm run dev

### Login Credentails
** Email ** - amarjeetchoudhary6@gmail.com
** Password ** - Manish@786

-  ** Run Backend ** - npm run dev

### Login Credentails
** Email ** - amarjeetchoudhary6@gmail.com
** Password ** - Manish@786

# 📄 PDF Annotator Full-Stack Application

A beautiful, modern full-stack React application that allows users to upload PDF files, create highlights, and manage their document library with persistent annotations.

![PDF Annotator](https://img.shields.io/badge/PDF-Annotator-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6?style=for-the-badge&logo=typescript)

## ✨ Features

### 🎨 Frontend (React)
- **🔐 User Authentication** - Secure registration and login with JWT tokens
- **📤 PDF Upload** - Drag & drop file upload with beautiful animations
- **👁️ PDF Viewer** - Built-in PDF viewer with Chrome's native rendering
- **🖍️ Text Highlighting** - Interactive highlighting system with visual feedback
- **📚 Library Dashboard** - Manage your PDF collection with modern UI
- **🎭 Beautiful Animations** - Smooth transitions and glassmorphism effects
- **📱 Responsive Design** - Works perfectly on all devices

### ⚙️ Backend (Node.js + Express + TypeScript)
- **🔑 JWT Authentication** - Secure token-based authentication
- **📁 File Management** - Local PDF storage with UUID tracking
- **🗄️ Database Operations** - Full CRUD operations for PDFs and highlights
- **🛡️ Security Middleware** - Protected routes and input validation
- **📊 MongoDB Integration** - Efficient data persistence

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, React Router, Axios, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript, Mongoose |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Tokens) |
| **Storage** | Local file system |
| **Styling** | Tailwind CSS with custom animations |

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Install Guide](https://docs.mongodb.com/manual/installation/)
- **npm** or **yarn** package manager

### 🔧 Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the backend directory:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/pdf-annotator
   
   # Server
   PORT=5000
   
   # JWT Secrets (generate your own secure secrets)
   ACCESS_TOKEN_SECRET=your_super_secure_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   ✅ Backend will be running on `http://localhost:5000`

### 🎨 Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   ✅ Frontend will be running on `http://localhost:5173`

4. **Open your browser:**
   Navigate to `http://localhost:5173` and start using the application!

## 📡 API Documentation

### 🔐 Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/v1/api/users/register` | Register a new user | ❌ |
| `POST` | `/v1/api/users/login` | Login user | ❌ |

### 📄 PDF Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/v1/api/pdfs/upload` | Upload a PDF file | ✅ |
| `GET` | `/v1/api/pdfs` | Get user's PDFs | ✅ |
| `GET` | `/v1/api/pdfs/:uuid/view` | View a PDF file | ✅ |
| `PUT` | `/v1/api/pdfs/:uuid/rename` | Rename a PDF | ✅ |
| `DELETE` | `/v1/api/pdfs/:uuid` | Delete a PDF | ✅ |

### 🖍️ Highlight Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/v1/api/highlights` | Create a highlight | ✅ |
| `GET` | `/v1/api/highlights/:pdfUuid` | Get highlights for a PDF | ✅ |
| `PUT` | `/v1/api/highlights/:id` | Update a highlight | ✅ |
| `DELETE` | `/v1/api/highlights/:id` | Delete a highlight | ✅ |

## 🎯 How to Use

### 1. **Create Account**
- Visit the application and click "Create Account"
- Fill in your details and register
- Login with your credentials

### 2. **Upload PDFs**
- Drag and drop PDF files onto the upload area
- Or click "Choose PDF File" to browse
- Files are automatically saved to your library

### 3. **View and Highlight**
- Click "View" on any PDF in your library
- Toggle "Highlight Mode" to start highlighting
- Draw rectangles over text to create highlights
- Use "Add Manual Highlight" for text-based annotations

### 4. **Manage Highlights**
- Click the highlights counter to open the side panel
- View all your highlights with timestamps
- Delete highlights by clicking on them
- Highlights persist across sessions

## 📁 Project Structure

```
pdf-annotator-full-stack/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Request handlers
│   │   ├── 📁 models/          # Database schemas
│   │   ├── 📁 routes/          # API routes
│   │   ├── 📁 middlewares/     # Auth & validation
│   │   ├── 📁 utils/           # Helper functions
│   │   ├── 📁 db/              # Database connection
│   │   ├── 📄 app.ts           # Express app setup
│   │   └── 📄 index.ts         # Server entry point
│   ├── 📁 uploads/             # PDF storage (auto-created)
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   └── 📄 .env
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   │   ├── 📄 Login.jsx
│   │   │   ├── 📄 Register.jsx
│   │   │   ├── 📄 Dashboard.jsx
│   │   │   ├── 📄 PDFViewer.jsx
│   │   │   ├── 📄 HighlightOverlay.jsx
│   │   │   └── 📄 HighlightToolbar.jsx
│   │   ├── 📁 contexts/        # React contexts
│   │   │   └── 📄 AuthContext.jsx
│   │   ├── 📄 App.jsx
│   │   ├── 📄 App.css
│   │   ├── 📄 index.css
│   │   └── 📄 main.jsx
│   ├── 📁 public/
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 tailwind.config.js
├── 📄 README.md
└── 📄 .gitignore
```

## 🎨 UI Features

### ✨ Animations & Effects
- **Blob animations** - Floating background elements
- **Glassmorphism** - Frosted glass effect on cards
- **Hover effects** - Interactive button animations
- **Loading states** - Beautiful loading spinners
- **Fade transitions** - Smooth page transitions

### 🎯 User Experience
- **Drag & drop** - Intuitive file upload
- **Visual feedback** - Real-time highlighting
- **Responsive design** - Works on all screen sizes
- **Error handling** - User-friendly error messages
- **Empty states** - Helpful guidance for new users

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
```

**Frontend:**
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Required Environment Variables
MONGO_URI=mongodb://localhost:27017/pdf-annotator
PORT=5000
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Optional: For production
NODE_ENV=development
```

## 🚀 Deployment

### Backend Deployment
1. Build the TypeScript code: `npm run build`
2. Set environment variables on your hosting platform
3. Start the server: `npm start`

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure your server to serve the React app

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB** for the flexible database
- **Express.js** for the web framework
- **PDF.js** for PDF rendering capabilities

## 📞 Support

If you have any questions or need help, please:
- 📧 Email: [your-email@example.com]
- 🐛 Open an issue on GitHub
- 💬 Start a discussion

---

<div align="center">
  <p>Made with ❤️ by [Your Name]</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
