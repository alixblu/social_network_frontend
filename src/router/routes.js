import config from "../config";
import Home from "../pages/user/home"


const PublicRoutes = [
    {path : config.routes.home , component: Home}
];

export default PublicRoutes