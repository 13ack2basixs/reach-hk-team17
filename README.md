# REACH - Race for Education Accessibilities for Every Child

A comprehensive web platform for managing educational programs, donor relationships, and student progress tracking for REACH, a Hong Kong-based charity organization.

## 🎯 Project Overview

REACH is dedicated to providing educational opportunities for children in need. This platform serves as a central hub for:
- **Donor Management**: Track donations, manage donor profiles, and generate insights
- **Student Progress**: Monitor academic performance and learning milestones
- **Content Management**: Create and publish stories about student achievements
- **Announcements**: Share updates and celebrate student successes

## ✨ Key Features

### 🏠 Home Page
- Hero section with mission statement
- Program highlights and impact statistics
- Call-to-action for donations

### 💰 Donate Page
- **FPS QR Code**: Direct payment via Hong Kong's Faster Payment System
- **Bank Transfer**: Complete banking details for wire transfers
- **Credit Card/Alipay**: Secure online payments via Stripe
- Tax exemption information for Hong Kong donors

### 📊 Admin Dashboard
- **Blog Creator**: AI-powered story generation with image uploads
- **Announcement Management**: Publish student achievements and milestones
- **Student Grade Tracking**: Monitor academic progress across schools
- **Donor Management**: 
  - Comprehensive donor profiles and donation history
  - Real-time analytics and charts
  - Search and filter capabilities
  - Individual vs Corporate donor tracking

### 📖 Stories/Blogs
- Write Blogs with the help of GenAi
- Dynamic content from Firebase
- Category filtering and search
- Featured stories with rich media


## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd reach-hk-team17
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_SENDER_ID=your_sender_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8084` (or the port shown in terminal)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── Navigation.tsx  # Main navigation
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Donate.tsx      # Donation page
│   ├── Admin.tsx       # Admin dashboard
│   ├── Blogs.tsx       # Stories/blog page
│   └── ...
├── services/           # Firebase services
│   └── donorService.ts # Donor management logic
├── contexts/           # React contexts
│   └── AnnouncementContext.tsx
├── lib/                # Utilities and configurations
│   └── firebase.ts     # Firebase setup
└── hooks/              # Custom React hooks
```

## 🔥 Firebase Collections

The project uses the following Firestore collections:
- `donors` - Donor profiles and information
- `donations` - Individual donation records
- `stories` - Blog posts and student stories
- `announcements` - Student achievement announcements

## 🎨 Design System

Built with shadcn/ui and Tailwind CSS for a consistent, modern design:
- **Color Scheme**: Primary blues and greens with warm accents
- **Typography**: Clean, readable fonts
- **Components**: Accessible, responsive UI components
- **Layout**: Mobile-first responsive design

## 📱 Features in Detail

### Donor Management
- **Real-time Updates**: Live data synchronization with Firebase
- **Advanced Filtering**: Search by name, email, school, or donor type
- **Analytics Dashboard**: Monthly trends, school breakdowns, and key metrics
- **Profile Management**: Complete donation history and contact information

### Content Management
- **AI Blog Generation**: Create engaging stories from images and descriptions
- **Announcement System**: Celebrate student achievements
- **Media Upload**: Support for multiple image formats
- **Rich Text Editing**: Format content with markdown support

### Payment Integration
- **FPS QR Code**: Hong Kong's preferred payment method
- **Stripe Integration**: Secure credit card and Alipay processing
- **Bank Transfer Details**: Complete banking information
- **Tax Receipts**: Hong Kong tax exemption compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for REACH Hong Kong.

## 🆘 Support

For technical support or questions about the platform, please contact the development team.

---

**Built with ❤️ for REACH Hong Kong**
