# Heart Angiography & Blood Vessel Blockage Detection System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**A modern, professional medical UI application for analyzing angiography images and detecting blood vessel blockages using AI-powered analysis.**

[Features](#-features) • [Installation](#-getting-started) • [Usage](#-usage) • [Documentation](#-documentation) • [License](#-license)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Components](#-components)
- [Authentication](#-authentication)
- [API Integrations](#-api-integrations)
- [PDF Export](#-pdf-export)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Overview

The Heart Angiography & Blood Vessel Blockage Detection System is a comprehensive medical imaging analysis application designed for healthcare professionals. It leverages AI-powered technology to analyze angiography images, detect arterial blockages, and provide detailed clinical insights with a modern, intuitive user interface.

### Key Capabilities

- **AI-Powered Image Analysis**: Advanced detection of blood vessel blockages and arterial narrowing
- **Interactive Visualization**: Side-by-side comparison of original and processed images
- **Comprehensive Reporting**: Detailed analysis reports with severity indicators and clinical recommendations
- **Professional PDF Export**: Generate complete analysis reports in PDF format
- **Secure Authentication**: Protected access with user authentication system
- **Open Source AI Integration**: Additional insights using freely available AI models

---

## ✨ Features

### 🎨 User Interface
- **Modern Medical Theme**: Beautiful gradient-based design with medical color palette
- **Glass-morphism Effects**: Translucent cards with backdrop blur for premium feel
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Interactive hover effects, transitions, and micro-interactions
- **Dark/Light Mode Ready**: Professional color schemes suitable for medical environments

### 📤 Image Upload & Processing
- **Drag & Drop Upload**: Easy image upload with instant preview
- **Multiple Format Support**: JPG, PNG, DICOM, and other medical image formats
- **Image Validation**: Automatic format and size validation
- **Real-time Preview**: Instant image preview before analysis

### 🤖 AI Analysis
- **Roboflow Integration**: Integration with Roboflow API for advanced object detection
- **Automated Detection**: Automatic identification of blockages and arterial narrowing
- **Confidence Scoring**: AI confidence scores for each detection
- **Severity Assessment**: Automated severity level classification (Low/Medium/High)

### 📊 Analysis Results
- **Comprehensive Metrics**:
  - Clot Probability
  - Blockage Location
  - Narrowing Percentage
  - Confidence Score
- **Visual Indicators**: Color-coded severity indicators
- **Interactive Comparison**: Slider-based image comparison tool
- **Clinical Recommendations**: AI-generated medical suggestions

### 💡 AI Insights & Recommendations
- **AI-Generated Suggestions**: Contextual medical insights based on analysis
- **Clinical Steps**: Recommended next clinical steps
- **Risk Factor Analysis**: Identification of relevant cardiovascular risk factors
- **Doctor's Notes**: Section for medical professionals to add custom recommendations

### 🔐 Authentication & Security
- **Secure Login System**: Protected access with email/password authentication
- **Session Management**: Persistent login sessions with localStorage
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **User Management**: User profile display and logout functionality

### 📄 PDF Export
- **Complete Report Generation**: Comprehensive PDF reports with all analysis data
- **Professional Formatting**: Medical-grade report layout
- **Image Integration**: Original and processed images included
- **Clinical Documentation**: All insights, recommendations, and notes included

### 🔄 Open Source AI Integration
- **Hugging Face Models**: Integration with open source AI models via Hugging Face API
- **Enhanced Insights**: Additional AI-generated medical interpretations
- **Fallback Mode**: Graceful degradation to demo mode if API unavailable

---

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Secure JSON Web Token authentication
- **Multer** - File upload handling
- **Axios** - HTTP client

### Frontend
- **React 18.2.0** - Modern UI framework
- **React Router 6.20.0** - Client-side routing
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **React Icons 4.12.0** - Comprehensive icon library
- **Vite 5.0.8** - Fast build tool and dev server

### PDF Generation
- **jsPDF 3.0.3** - PDF document generation
- **html2canvas 1.4.1** - HTML to canvas conversion

### Development Tools
- **PostCSS 8.4.32** - CSS processing
- **Autoprefixer 10.4.16** - Automatic vendor prefixing
- **TypeScript Types** - Type definitions for React

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (Must be installed and running locally)
- **npm** (v7 or higher)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blood-angio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory (see Configuration section).

4. **Start the Application**
   You need to run both the backend server and frontend client.

   **Terminal 1 (Backend):**
   ```bash
   npm run server
   ```

   **Terminal 2 (Frontend):**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root containing your secrets.

**Server-Side Secrets (Secure):**
```env
# Database
MONGO_URI=mongodb://localhost:27017/heart_angio_db
JWT_SECRET=your_super_secret_jwt_key

# External APIs
# NOTE: This key is now securely handled on the backend
ULTRALYTICS_API_KEY=your_ultralytics_key_here
```

**Client-Side Configuration:**
```env
# Optional: Public facing config if needed
# VITE_APP_NAME="Heart Angio AI"
```

### Secure Proxy Configuration

The application implements a secure backend proxy (`/api/analysis/detect`) to handle all AI processing. This ensures your **Ultralytics API Key** is never exposed to the client browser.

---

## 📖 Usage

### Authentication

The system uses a robust **JWT (JSON Web Token)** authentication system powered by MongoDB.

1. **Registration**:
   - (Currently restricted to Admin creation or specific flow)
   
2. **Login**:
   - Navigate to `/login`
   - Enter your registered email and password
   - Authentication validates against the MongoDB database

3. **Logout**:
   - Click "Logout" to clear the session token
   - Securely redirects to login page

### Image Analysis Workflow

1. **Upload Image**
   - Go to the Upload page
   - Drag and drop an image or click to browse
   - Supported formats: JPG, PNG, DICOM

2. **Start Analysis**
   - Click "Start AI Analysis"
   - The image is securely uploaded to your local server
   - The server proxies the request to Ultralytics AI
   - Results are returned and visualized

3. **Review Results**
   - View analysis metrics on the Analysis page
   - Check severity indicators
   - Review AI-generated suggestions

4. **Generate AI Insights** (Optional)
   - Click "Generate AI Insights" in the Open Source AI section
   - Review additional AI interpretations and recommendations

5. **Add Doctor's Notes** (Optional)
   - Enter medical recommendations in the Doctor's Suggestion section
   - Click "Save Note" to store

6. **Export PDF**
   - Click "Download PDF Report" button
   - PDF will be generated with all analysis data
   - Report includes images, metrics, insights, and notes

---

## 📁 Project Structure

```
blood-angio/
├── public/                 # Static assets
├── server/                 # Backend Server Code
│   ├── index.js            # Entry point
│   ├── routes/             # API Routes
│   ├── models/             # MongoDB Models
│   └── middleware/         # Auth & Utilities
├── src/                    # Frontend Client Code
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   ├── services/           # API and utility services
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Application entry point
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── README.md               # This file
```

---

## 🧩 Components

### Navigation & Layout
- **Navbar**: Top navigation with logo, menu items, and user controls
- **ProtectedRoute**: Wrapper component for protected pages

### Upload & Display
- **UploadBox**: Drag-and-drop file upload with preview
- **ComparisonSlider**: Interactive slider for image comparison
- **LoaderAnimation**: Animated loading indicators

### Analysis & Results
- **AnalysisCard**: Displays individual analysis metrics
- **SeverityIndicator**: Color-coded severity level display
- **AIGeneratedSuggestions**: AI-generated medical suggestions
- **DoctorsSuggestion**: Textarea for doctor's notes
- **OpenSourceAIInsights**: Open source AI insights component

---

## 🔐 Authentication

### Production Implementation

The application uses a secure, production-grade authentication system:

- **MongoDB Storage**: User credentials are hashed (bcrypt) and stored in MongoDB.
- **JWT Tokens**: Secure stateless authentication using JSON Web Tokens.
- **Protected Routes**: Middleware ensures only authenticated requests can access analysis APIs.
- **Secure Handling**: No sensitive data is stored in LocalStorage (only the token).

---

## 🔌 API Integrations

### Ultralytics API (Secure Proxy)

**Purpose**: professional-grade medical image analysis.

**Security**:
- **Implementation**: Requests are proxied through your local Express server.
- **Data Flow**: Client → Local Server → Ultralytics.
- **Benefit**: Your API Key is **NEVER** exposed to the browser/users.

### Hugging Face API

**Purpose**: Open source AI model integration for additional insights
**Setup**: Add `VITE_HUGGINGFACE_API_KEY` to `.env` if using client-side calls (Consider moving to backend for production).

---

## 📄 PDF Export

### Features

- **Complete Reports**: All analysis data included
- **Professional Layout**: Medical-grade formatting
- **Image Integration**: Original and processed images
- **Multi-page Support**: Automatic pagination
- **Sections Included**:
  - Analysis Overview
  - Angiography Images
  - AI-Generated Suggestions
  - Doctor's Recommendations
  - Open Source AI Insights
  - Analysis Summary

### Usage

1. Navigate to Analysis page
2. Click "Download PDF Report" button
3. PDF is generated and automatically downloaded
4. Filename format: `Angiography_Analysis_YYYY-MM-DD_timestamp.pdf`

### Customization

Edit `src/services/pdfGenerator.js` to customize:
- PDF layout and styling
- Sections included
- Image size and quality
- Header/footer content

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Full Stack Deployment

Since this is a MERN stack application, you need to deploy both:
1. **Frontend**: Static files in `dist/` (to Netlify, Vercel, or served by Express).
2. **Backend**: The Node.js server (to Heroku, Railway, AWS, or VPS).
3. **Database**: A MongoDB Atlas cluster or self-hosted instance.

### Environment Variables

Ensure all environment variables from `.env` are set in your production environment.

### Important Notes

- Update API endpoints to the production URL.
- Configure CORS settings in `server/index.js` for your domain.
- Use a strong `JWT_SECRET`.
- Ensure MongoDB connection string is secure.

---

## 🔧 Troubleshooting

### Common Issues

**Issue**: "Login Failed" or "Network Error"
- **Solution**: Ensure the backend server is running (`npm run server`).
- **Solution**: Ensure MongoDB is running.

**Issue**: API Key Error
- **Solution**: Check `ULTRALYTICS_API_KEY` in your `.env` file (Server side).

**Issue**: Images not loading in PDF
- **Solution**: Check CORS settings for image sources
- **Solution**: Ensure images are from same origin or CORS-enabled

**Issue**: API calls failing
- **Solution**: Verify API keys are correctly configured
- **Solution**: Check network connectivity
- **Solution**: Verify API endpoint URLs

**Issue**: Build errors
- **Solution**: Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- **Solution**: Clear Vite cache: `rm -rf .vite`

**Issue**: Tailwind styles not applying
- **Solution**: Rebuild Tailwind: `npm run build`
- **Solution**: Check `tailwind.config.js` content paths

### Getting Help

- Check the console for error messages
- Verify all dependencies are installed
- Ensure Node.js version is compatible
- Review API documentation for integration issues

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🎨 Design System

### Colors
- **Medical Blue**: `#3B82F6`
- **Medical Cyan**: `#06B6D4`
- **Medical Teal**: `#14B8A6`
- **Medical Purple**: `#8B5CF6`
- **Medical Pink**: `#EC4899`

### Typography
- **Headings**: Bold, medical-grade hierarchy
- **Body**: Readable, professional fonts
- **Code**: Monospace for technical content

### Spacing
- Consistent spacing system using Tailwind's spacing scale
- Responsive padding and margins

---

## 🔒 Security Considerations

### Current Implementation
- Frontend-only authentication (demo mode)
- localStorage for session storage
- No backend validation

### Production Recommendations
- Implement secure backend authentication
- Use HTTPS for all API calls
- Implement token refresh mechanisms
- Add rate limiting for API calls
- Validate all user inputs
- Implement proper error handling
- Add logging and monitoring
- Follow medical data compliance (HIPAA, GDPR)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **React** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Roboflow** for AI detection capabilities
- **Hugging Face** for open source AI models
- **React Icons** for the comprehensive icon library

---

## 📧 Support

For issues, questions, or contributions, please open an issue on the repository.

---

<div align="center">

**Built with ❤️ for medical professionals**

*Heart Angiography Detection System v1.0.0*

</div>
