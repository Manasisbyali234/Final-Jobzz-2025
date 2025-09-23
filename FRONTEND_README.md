# Final-Jobzz-2025 Frontend - React Job Portal

## Overview
The frontend is a modern React.js application that provides an intuitive interface for the job portal platform. It features separate dashboards for candidates, employers, and administrators with responsive design and smooth user experience.

## Quick Start

### Installation
```bash
npm install
```

### Development Server
```bash
npm start
```
Opens [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Technology Stack

### Core Technologies
- **React 18.2.0** - Main framework
- **React Router DOM 6.14.0** - Client-side routing
- **Bootstrap 5.3.8** - UI framework
- **React Bootstrap 2.10.10** - Bootstrap components for React

### Additional Libraries
- **Axios 1.11.0** - HTTP client for API calls
- **Chart.js 4.4.0** & **React-ChartJS-2 5.2.0** - Data visualization
- **AOS 2.3.4** - Animate On Scroll library
- **React Icons 5.5.0** - Icon library
- **Lucide React 0.544.0** - Modern icon set
- **React CountUp 6.4.2** - Animated counters

## Project Structure

```
src/
├── app/                          # Main application components
│   ├── common/                   # Shared components
│   │   ├── floating/            # Floating menu components
│   │   ├── footer/              # Footer variants
│   │   ├── header/              # Header variants
│   │   ├── popups/              # Modal components
│   │   ├── inner-page-banner.jsx
│   │   ├── jobz-img.jsx
│   │   └── loader.jsx
│   ├── form-processing/         # Form handling
│   └── pannels/                 # User-specific dashboards
│       ├── admin/               # Admin panel
│       ├── candidate/           # Candidate dashboard
│       ├── employer/            # Employer dashboard
│       └── public-user/         # Public pages
├── components/                   # Reusable components
├── contexts/                     # React contexts
├── globals/                      # Global configurations
├── layouts/                      # Layout components
├── routing/                      # Route configurations
├── utils/                        # Utility functions
├── App.js                        # Main app component
├── index.js                      # Entry point
└── global-styles.css            # Global styles
```

## Architecture

### Component Hierarchy
```
App
├── AuthProvider (Context)
├── ScrollToTop
├── Loader
└── RootLayout
    ├── PublicUserLayout
    ├── CandidateLayout
    ├── EmployerLayout
    └── AdminLayout
```

### Routing System
The application uses React Router with role-based routing:
- **Public Routes**: Accessible to all users
- **Candidate Routes**: Protected routes for candidates
- **Employer Routes**: Protected routes for employers
- **Admin Routes**: Protected routes for administrators

## Key Features

### Authentication System
- JWT-based authentication
- Role-based access control
- Persistent login sessions
- Automatic token refresh
- Protected routes

### Multi-User Dashboards

#### Candidate Dashboard
- Profile management
- Job search and filtering
- Application tracking
- Resume builder
- Interview scheduling
- Notifications

#### Employer Dashboard
- Company profile management
- Job posting and management
- Candidate search and filtering
- Application review
- Interview scheduling
- Analytics and reports

#### Admin Dashboard
- User management (candidates & employers)
- Job moderation
- System statistics
- Content management
- Application oversight

### Responsive Design
- Mobile-first approach
- Bootstrap grid system
- Responsive navigation
- Touch-friendly interfaces
- Cross-browser compatibility

## Component Documentation

### Layout Components

#### RootLayout (`layouts/root-layout.jsx`)
Main layout wrapper that handles routing and layout switching based on user role.

#### PublicUserLayout (`layouts/public-user-layout.jsx`)
Layout for non-authenticated users with public header and footer.

#### CandidateLayout (`layouts/candidate-layout.jsx`)
Dashboard layout for candidates with sidebar navigation.

#### EmployerLayout (`layouts/employer-layout.jsx`)
Dashboard layout for employers with sidebar navigation.

#### AdminLayout (`layouts/admin-layout.jsx`)
Administrative layout with admin-specific navigation.

### Common Components

#### Header Components
- `header1.jsx` - Main public header
- `header2.jsx` - Alternative header style

#### Footer Components
- `footer1.jsx` - Main footer
- `footer2.jsx` - Alternative footer
- `footer3.jsx` - Minimal footer
- `footer4.jsx` - Extended footer

#### Popup Components
- `popup-signin.jsx` - Login modal
- `popup-signup.jsx` - Registration modal
- `popup-apply-job.jsx` - Job application modal
- `popup-job-view.jsx` - Job details modal
- `forgot-password.jsx` - Password reset modal

### Utility Components

#### ProtectedRoute (`components/ProtectedRoute.jsx`)
Route wrapper that checks authentication and role permissions.

#### Loader (`app/common/loader.jsx`)
Loading spinner component with animations.

#### NotificationBell (`components/NotificationBell.jsx`)
Real-time notification component.

## State Management

### Authentication Context (`contexts/AuthContext.js`)
Centralized authentication state management:
```javascript
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Authentication methods
  const login = async (credentials, userType) => { /* ... */ };
  const logout = () => { /* ... */ };
  const checkAuth = () => { /* ... */ };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Local State Management
- Component-level state with useState
- Form state management
- UI state (modals, loading states)
- Temporary data storage

## API Integration

### API Utility (`utils/api.js`)
Centralized API client with authentication handling:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = (userType = 'candidate') => {
  const token = localStorage.getItem(`${userType}Token`);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Public APIs
  getJobs: (params = {}) => { /* ... */ },
  getJobById: (id) => { /* ... */ },
  
  // Candidate APIs
  candidateLogin: (data) => { /* ... */ },
  getCandidateProfile: () => { /* ... */ },
  
  // Employer APIs
  employerLogin: (data) => { /* ... */ },
  postJob: (jobData) => { /* ... */ },
  
  // Admin APIs
  adminLogin: (data) => { /* ... */ },
  getAdminStats: () => { /* ... */ }
};
```

### Error Handling
- Global error boundaries
- API error handling
- User-friendly error messages
- Retry mechanisms

## Styling and UI

### CSS Architecture
- Global styles in `global-styles.css`
- Component-specific CSS modules
- Bootstrap utility classes
- Custom CSS variables

### Theme System
- Multiple color schemes (skins)
- Consistent spacing system
- Typography scale
- Responsive breakpoints

### Animation System
- AOS (Animate On Scroll) integration
- CSS transitions
- Loading animations
- Hover effects

## Routing Configuration

### Route Structure
```javascript
// Public Routes
/                    # Home page
/jobs               # Job listings
/jobs/:id           # Job details
/companies          # Company listings
/about              # About page
/contact            # Contact page
/login              # Login page

// Candidate Routes
/candidate/dashboard        # Dashboard
/candidate/profile         # Profile management
/candidate/applications    # Job applications
/candidate/resume         # Resume builder

// Employer Routes
/employer/dashboard       # Dashboard
/employer/profile        # Company profile
/employer/jobs           # Job management
/employer/candidates     # Candidate search

// Admin Routes
/admin/dashboard         # Admin dashboard
/admin/users            # User management
/admin/jobs             # Job moderation
```

### Protected Routes Implementation
```javascript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};
```

## Form Handling

### Form Components
- Registration forms (candidate/employer)
- Login forms
- Job posting forms
- Profile update forms
- Application forms

### Validation
- Client-side validation
- Real-time validation feedback
- Server-side validation integration
- Error message display

### File Upload
- Resume upload with preview
- Company logo upload
- Base64 encoding for API
- File type validation

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Lazy loading of components
- Dynamic imports

### Bundle Optimization
- Tree shaking
- Minification
- Compression
- Asset optimization

### Runtime Performance
- Memoization with React.memo
- useCallback and useMemo hooks
- Efficient re-rendering
- Virtual scrolling for large lists

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 576px) { /* Small devices */ }
@media (min-width: 768px) { /* Medium devices */ }
@media (min-width: 992px) { /* Large devices */ }
@media (min-width: 1200px) { /* Extra large devices */ }
```

### Mobile Features
- Touch-friendly navigation
- Swipe gestures
- Mobile-optimized forms
- Responsive images
- Progressive Web App features

## Testing

### Testing Strategy
- Unit tests for components
- Integration tests for user flows
- API integration tests
- End-to-end testing

### Testing Tools
- Jest (included with Create React App)
- React Testing Library
- Mock Service Worker for API mocking

## Build and Deployment

### Build Process
```bash
npm run build
```
Creates optimized production build in `build/` folder.

### Environment Configuration
```javascript
// Environment variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: AWS CloudFront, Cloudflare
- **Traditional Hosting**: Apache, Nginx

### Production Optimizations
- Minified JavaScript and CSS
- Compressed assets
- Service worker for caching
- Progressive Web App features

## Browser Support

### Supported Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Polyfills
- ES6+ features
- Fetch API
- CSS Grid (if needed)

## Accessibility

### WCAG Compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Color contrast compliance

### Accessibility Features
- Focus management
- Skip links
- Alt text for images
- Form labels
- Error announcements

## Development Guidelines

### Code Style
- ESLint configuration
- Prettier formatting
- Consistent naming conventions
- Component documentation

### Component Guidelines
```javascript
// Component template
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  const handleEvent = () => {
    // Event handler
  };
  
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.required,
  prop2: PropTypes.number
};

ComponentName.defaultProps = {
  prop2: 0
};

export default ComponentName;
```

### File Naming Conventions
- Components: PascalCase (e.g., `JobCard.jsx`)
- Utilities: camelCase (e.g., `apiHelper.js`)
- Styles: kebab-case (e.g., `job-card.css`)
- Constants: UPPER_SNAKE_CASE

## Troubleshooting

### Common Issues
1. **Build Errors**: Check for syntax errors and missing dependencies
2. **API Connection**: Verify backend server is running
3. **Authentication Issues**: Check token storage and expiration
4. **Routing Problems**: Verify route configuration and protection

### Debug Tools
- React Developer Tools
- Redux DevTools (if using Redux)
- Network tab for API debugging
- Console logging

## Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes following guidelines
4. Test thoroughly
5. Submit pull request

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Components are properly documented
- [ ] Tests are included
- [ ] No console errors
- [ ] Responsive design works
- [ ] Accessibility standards met

## Future Enhancements

### Planned Features
- Real-time chat system
- Advanced search filters
- Video interview integration
- Mobile app development
- PWA features

### Technical Improvements
- State management with Redux Toolkit
- GraphQL integration
- Micro-frontend architecture
- Advanced caching strategies

## License
This project is licensed under the MIT License.