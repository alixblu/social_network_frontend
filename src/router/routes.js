import config from "../config";
import Home from "../pages/user/home"
import Profile from "../pages/user/profile";
import FriendsPage from '../pages/user/FriendsPage'
import popupPost from "../components/content/popup/popupPost";
import content from "../components/content/contentArea";

const PublicRoutes = [
    {path : config.routes.home , component: Home},
    {path : config.routes.profile , component: Profile},
    {path: config.routes.friends, component: FriendsPage },
    {path: config.routes.test, component: content},
];

export default PublicRoutes;
