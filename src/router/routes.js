import config from "../config";
import Home from "../pages/user/home";
import FriendsPage from "../pages/user/FriendsPage"; // Đảm bảo đường dẫn đúng

const PublicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.friends, component: FriendsPage },
];

export default PublicRoutes;
