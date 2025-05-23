import config from "../config";
import Home from "../pages/user/home"
import Profile from "../pages/user/profile";
import FriendsPage from '../pages/user/FriendsPage'
import content from "../components/content/contentArea";
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import ChangePass from '../pages/auth/changePassword'
import Admin from '../pages/admin/admin'

const PublicRoutes = [
    {path : config.routes.home , component: Home},
    {path : config.routes.profile , component: Profile},
    {path: config.routes.friends, component: FriendsPage },
    {path: config.routes.test, component: content},
    {path: config.routes.login, component: Login },
    {path: config.routes.register, component: Register },
    {path: config.routes.admin, component: Admin },
    {path: config.routes.changePassword, component: ChangePass },
];

export default PublicRoutes;
