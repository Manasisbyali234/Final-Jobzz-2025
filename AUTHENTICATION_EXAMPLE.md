# Authentication & Route Protection Implementation

## Files Modified/Created:

### 1. ProtectedRoute Component (`src/components/ProtectedRoute.jsx`)
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

### 2. Updated App Routes (`src/routing/app-routes.jsx`)
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

### 3. Updated Logout Popup (`src/app/common/popups/popup-yes-no.jsx`)
```jsx
import { useNavigate } from "react-router-dom";
import { popupType } from "../../../globals/constants";
import { publicUser } from "../../../globals/route-names";
import { useAuth } from "../../../contexts/AuthContext";

function YesNoPopup(props) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const yesHandler = () => {
        if(props.type === popupType.LOGOUT) {
            logout(); // Clears all tokens from localStorage
            navigateToAfterLogin();
        }
    }

    const navigateToAfterLogin = () => {
        navigate(publicUser.pages.AFTER_LOGIN);
    }
    // ... rest of component
}
```

## How It Works:

### Authentication Flow:
1. **Login**: User logs in → Token stored in localStorage as `candidateToken` or `employerToken`
2. **Route Access**: User tries to access protected route → ProtectedRoute checks for appropriate token
3. **Access Granted**: If token exists → User can access the route
4. **Access Denied**: If no token → User redirected to `/login`
5. **Logout**: User clicks logout → All tokens cleared → Protected routes become inaccessible

### Token Storage:
- Candidate: `candidateToken` in localStorage
- Employer: `employerToken` in localStorage  
- Admin: `adminToken` in localStorage

### Route Protection:
- `/candidate/*` routes require `candidateToken`
- `/employer/*` routes require `employerToken`
- `/admin/*` routes are not protected (add ProtectedRoute if needed)

### Manual URL Access Prevention:
- Direct access to `/candidate-dashboard` without token → Redirect to `/login`
- Direct access to `/employer-dashboard` without token → Redirect to `/login`
- After logout, all protected routes become inaccessible

### Example Usage in Login Component:
```jsx
// In your login component, after successful login:
const handleLogin = async (credentials, userType) => {
    const result = await login(credentials, userType);
    if (result.success) {
        // Token is automatically stored in localStorage by AuthContext
        // Redirect to appropriate dashboard
        if (userType === 'candidate') {
            navigate('/candidate-dashboard');
        } else if (userType === 'employer') {
            navigate('/employer-dashboard');
        }
    }
};
```

## Security Features:
✅ Token-based authentication
✅ Role-based route protection  
✅ Automatic logout clears all tokens
✅ Manual URL access prevention
✅ Redirect to login for unauthorized access
✅ State preservation for post-login redirect