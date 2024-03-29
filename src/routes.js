import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LendingPageLayout from "./layouts/LendingPageLayout";
//

import NotFound from "./pages/Page404";

import Lending from "./LendingPage/Lending";

import Drive from "./pages/Drive";
import Members from "./pages/Members";
import Alert from "./pages/Alert";
import Access from "./pages/Access";
import ChatBox from "./chatbox/ChatBox";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "drive", element: <Drive /> },
        { path: "members", element: <Members /> },
        { path: "alert", element: <Alert /> },
        { path: "access", element: <Access /> },
        { path: "messages", element: <ChatBox /> },
      ],
    },

    {
      path: "/",
      element: <LendingPageLayout />,
      children: [{ path: "/", element: <Lending /> }],
    },
    { path: "*", element: <Navigate to="/404" replace /> },

    { path: "404", element: <NotFound /> },
    { path: "*", element: <Navigate to="/404" /> },
  ]);
}
