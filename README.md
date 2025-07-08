# RecoverWise Frontend - Privacy-First Alcohol Recovery App

## 🌟 Overview

RecoverWise is a privacy-first web application designed to help individuals reduce and eventually stop alcohol use gradually. The frontend is built with React and uses **local storage exclusively** for data persistence, ensuring complete user privacy.

## 🔒 Privacy Features

- **100% Local Storage**: All user data is stored locally in the browser
- **No Server Dependencies**: The app works completely offline after initial load
- **No Data Transmission**: Personal information never leaves the user's device
- **No Tracking**: No analytics, cookies, or external tracking

## 🚀 Features

### Core Functionality
- **User Onboarding**: Personalized setup based on drinking patterns and goals
- **Progress Tracking**: WHO risk level monitoring and streak tracking
- **Consumption Logging**: Daily drink tracking with mood and trigger analysis
- **Habit Replacement**: Evidence-based alternative activities
- **Journal System**: Reflection and goal-setting tools
- **Crisis Support**: Immediate coping strategies and resources

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Progressive Web App**: Can be installed on devices
- **Offline Capable**: Full functionality without internet connection
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## 🛠️ Technology Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Storage**: Browser localStorage API
- **Build Tool**: Vite 6.x
- **Package Manager**: pnpm

## 📦 Installation & Development

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd alcohol_recovery_frontend

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open browser to http://localhost:5173
```

### Build for Production
```bash
# Build the application
pnpm run build

# Preview production build
pnpm run preview
```

## 🌐 Deployment Options

### Option 1: GitHub Pages (Recommended)

1. **Fork/Clone** this repository to your GitHub account
2. **Enable GitHub Pages** in repository settings
3. **Set up GitHub Actions** (workflow already included)
4. **Push to main branch** - automatic deployment will trigger

The app will be available at: `https://yourusername.github.io/RecoverWise/`

### Option 2: Netlify

1. **Connect** your GitHub repository to Netlify
2. **Build settings**:
   - Build command: `pnpm run build`
   - Publish directory: `dist`
3. **Deploy** - automatic deployment on git push

### Option 3: Vercel

1. **Import** project from GitHub to Vercel
2. **Framework preset**: Vite
3. **Build settings** are auto-detected
4. **Deploy** - automatic deployment on git push

### Option 4: Static File Hosting

1. **Build** the project: `pnpm run build`
2. **Upload** the `dist` folder contents to any static hosting service
3. **Configure** web server to serve `index.html` for all routes

## 🔧 Configuration

### Environment Variables

The app supports optional environment variables for API integration:

```bash
# Optional: Backend API URL (for future server integration)
REACT_APP_API_URL=https://your-backend-api.com/api

# The app defaults to local-only mode if not provided
```

### Local Storage Structure

The app stores data in the following localStorage keys:

- `recoverwise_user`: User profile and settings
- `recoverwise_consumption_logs`: Daily consumption tracking
- `recoverwise_journal_entries`: Journal and reflection entries
- `recoverwise_habit_activities`: Habit replacement activities
- `recoverwise_crisis_events`: Crisis support usage
- `recoverwise_habit_replacements`: Available habit alternatives

## 🎯 Usage Guide

### First Time Setup

1. **Open the application** in your web browser
2. **Complete onboarding** by answering questions about your drinking patterns
3. **Set your goals** for reduction or abstinence
4. **Start tracking** your daily progress

### Daily Use

1. **Log your consumption** using the "Log Today" button
2. **Record mood and triggers** to identify patterns
3. **Use habit replacements** when experiencing urges
4. **Write journal entries** for reflection and goal setting
5. **Access crisis support** if needed

### Data Management

- **Export data**: Use browser developer tools to copy localStorage
- **Import data**: Paste exported data back into localStorage
- **Clear data**: Use browser settings to clear site data
- **Backup**: Regularly export your data for safekeeping

## 🔒 Privacy & Security

### Data Protection
- All data remains on the user's device
- No server-side storage or transmission
- No third-party analytics or tracking
- No cookies or persistent identifiers

### Data Portability
- Users can export their data at any time
- Data is stored in standard JSON format
- Easy migration between devices or browsers

### Security Considerations
- Data is only as secure as the user's device
- Users should use device lock screens and secure browsers
- Regular data backups are recommended

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   └── ui/             # Radix UI component wrappers
├── config/             # Configuration files
│   └── environment.js  # Environment-based settings
├── services/           # Business logic and data services
│   ├── localStorage.js # Local storage management
│   └── api.js         # API integration (optional)
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

### Key Components

- **OnboardingFlow**: User setup and profiling
- **Dashboard**: Main application interface
- **ConsumptionLogger**: Daily tracking interface
- **JournalEntry**: Reflection and goal setting
- **HabitActivities**: Alternative behavior suggestions
- **CrisisMode**: Emergency support interface

### Local Storage Service

The `localStorage.js` service provides:
- Type-safe data operations
- Automatic data validation
- Error handling and recovery
- Data migration support

### Adding New Features

1. **Update data models** in `localStorage.js`
2. **Create UI components** following existing patterns
3. **Add to main App.jsx** component
4. **Test thoroughly** with various data states

## 🧪 Testing

### Manual Testing Checklist

- [ ] Onboarding flow completion
- [ ] Data persistence across browser sessions
- [ ] All form submissions and validations
- [ ] Responsive design on different screen sizes
- [ ] Offline functionality
- [ ] Data export/import capabilities

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Progressive Web App

The app includes PWA capabilities:

- **Installable**: Can be installed on devices
- **Offline**: Works without internet connection
- **Responsive**: Adapts to all screen sizes
- **Fast**: Optimized loading and performance

To install:
1. Open the app in a supported browser
2. Look for "Install" prompt or menu option
3. Follow browser-specific installation steps

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Use TypeScript for new components
- Follow existing component patterns
- Maintain accessibility standards
- Write clear, documented code

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- Check the documentation first
- Review existing GitHub issues
- Create a new issue with detailed information

### Emergency Resources
The app includes links to:
- SAMHSA National Helpline: 1-800-662-4357
- Crisis Text Line: Text HOME to 741741
- National Suicide Prevention Lifeline: 988

## 🔄 Updates

The app is designed to work independently, but updates may include:
- New habit replacement strategies
- Enhanced UI components
- Additional tracking features
- Improved accessibility

Check the GitHub repository for the latest version and updates.

---

**Built with ❤️ for privacy and recovery**

