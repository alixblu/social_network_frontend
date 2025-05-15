import ReportedPosts from '../pages/admin/ReportedPosts';
import Admin from '../pages/admin/admin';

// ... existing imports ...

const PublicRoutes = [
    // ... existing routes ...
    {
        path: "/admin/reported-posts",
        component: ReportedPosts,
        isPrivate: true,
        requiredRole: "ADMIN"
    },
    {
        path: "/Admin",
        component: Admin,
        isPrivate: true,
        requiredRole: "ADMIN"
    }
];

export default PublicRoutes; 