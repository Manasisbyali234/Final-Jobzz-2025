# Complete Authentication System Implementation

## 1. ProtectedRoute Component (`src/components/ProtectedRoute.js`)
```jsx
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem(`${requiredRole}Token`);
    const location = useLocation();
    
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return children;
};

export default ProtectedRoute;
```

## 2. Authentication Utilities (`src/utils/auth.js`)
```jsx
export const isAuthenticated = (role) => {
    return !!localStorage.getItem(`${role}Token`);
};

export const getCurrentUser = (role) => {
    const token = localStorage.getItem(`${role}Token`);
    const user = localStorage.getItem(`${role}User`);
    
    if (token && user) {
        try {
            return JSON.parse(user);
        } catch (error) {
            return null;
        }
    }
    return null;
};

export const logout = () => {
    localStorage.removeItem('candidateToken');
    localStorage.removeItem('employerToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('candidateUser');
    localStorage.removeItem('employerUser');
    localStorage.removeItem('adminUser');
};

export const redirectToLogin = (navigate, from = null) => {
    navigate('/login', { state: { from } });
};
```

## 3. Updated App Routes (`src/routing/app-routes.jsx`)
```jsx
import { Routes, Route } from "react-router-dom";
import PublicUserLayout from "../layouts/public-user-layout";
import EmployerLayout from "../layouts/employer-layout";
import CandidateLayout from "../layouts/candidate-layout";
import { base } from "../globals/route-names";
import AdminLayout from "../layouts/admin-layout";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path={base.PUBLIC_PRE + "/*"} element={<PublicUserLayout />} />
            <Route path={base.EMPLOYER_PRE + "/*"} element={
                <ProtectedRoute requiredRole="employer">
                    <EmployerLayout />
                </ProtectedRoute>
            } />
            <Route path={base.CANDIDATE_PRE + "/*"} element={
                <ProtectedRoute requiredRole="candidate">
                    <CandidateLayout />
                </ProtectedRoute>
            } />
            <Route path={base.ADMIN_PRE + "/*"} element={<AdminLayout />} />
        </Routes>
    )
}

export default AppRoutes;
```

## 4. JobCard Component with Authentication (`src/components/JobCard.jsx`)
```jsx
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, redirectToLogin } from '../utils/auth';

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    const handleApplyClick = () => {
        if (isAuthenticated('candidate')) {
            // User is logged in as candidate, proceed with application
            navigate(`/job-detail/${job._id}`);
        } else {
            // User not logged in, redirect to login
            redirectToLogin(navigate, `/job-detail/${job._id}`);
        }
    };

    return (
        <div className="job-card">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <button onClick={handleApplyClick} className="btn-apply">
                {isAuthenticated('candidate') ? 'Apply Now' : 'Login to Apply'}
            </button>
        </div>
    );
};

export default JobCard;
```

## 5. Updated Logout Handler (`src/app/common/popups/popup-yes-no.jsx`)
```jsx
import { logout as authLogout } from "../../../utils/auth";

const yesHandler = () => {
    if(props.type === popupType.LOGOUT) {
        logout(); // AuthContext logout
        authLogout(); // Clear all tokens
        navigateToAfterLogin();
    }
}
```

## How It Works:

### Route Protection:
- `/candidate/*` routes require `candidateToken`
- `/employer/*` routes require `employerToken`
- No token = redirect to `/login`

### Job Application Flow:
1. **Not Logged In**: Click "Apply" → Redirect to `/login`
2. **Logged In as Candidate**: Click "Apply" → Go to job detail page
3. **Logged In as Employer**: Cannot access candidate routes

### Logout Process:
1. User clicks logout
2. AuthContext logout() called
3. All tokens cleared from localStorage
4. Protected routes become inaccessible
5. Redirect to after-login page

### Token Storage:
- Candidate: `candidateToken` + `candidateUser`
- Employer: `employerToken` + `employerUser`
- Admin: `adminToken` + `adminUser`

### Security Features:
✅ Role-based route protection
✅ Authentication required for job applications
✅ Complete token cleanup on logout
✅ Automatic login redirects
✅ State preservation for post-login navigation
✅ Manual URL access prevention