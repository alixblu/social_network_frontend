import config from "../config";
import Home from "../pages/user/home"
import Profile from "../pages/user/profile";

const PublicRoutes = [
    {path : config.routes.home , component: Home},
    {path : config.routes.profile , component: Profile}
];

export default PublicRoutes