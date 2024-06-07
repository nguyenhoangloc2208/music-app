import { createBrowserRouter } from 'react-router-dom';
import RootPage from '../pages/RootPage';
import HomePage from '../pages/HomePage/HomePage';
import PlayListPage from '../pages/PlayListPage/PlayListPage';
import ErrorPage from '../pages/ErrorPage/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/playlist',
        element: <PlayListPage />,
      },
    ],
  },
]);

export default router;