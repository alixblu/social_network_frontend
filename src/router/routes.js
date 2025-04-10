import config from "../config";
import Home from "../pages/user/home"
import Profile from "../pages/user/profile";
import FriendsPage from '../pages/user/FriendsPage'

const PublicRoutes = [
    {path : config.routes.home , component: Home},
    {path : config.routes.profile , component: Profile},
    {path: config.routes.friends, component: FriendsPage },
];

export default PublicRoutes;
