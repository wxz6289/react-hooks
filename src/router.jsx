import { createBrowserRouter } from 'react-router-dom';
import BookablesPage from "./pages/Bookables/BookablesPage";
import BookingsPage from "./pages/Bookings/BookingsPage";
import UsersPage from "./pages/Users/UsersPage";
import TestPage from './pages/Test/TestPage';
import Counter from '@pages/Counter/Counter';
import UseStorage from '@pages/UseStorage/UseStorage';
import InfiniteCanvas from '@pages/canvas/InfiniteCanvas';
import App from './App'

const router = createBrowserRouter([
  {
    path: '/', element: <App />,
    children: [
      { path: '/bookings', element: <BookingsPage /> },
      { path: '/bookables', element: <BookablesPage /> },
      { path: '/users', element: <UsersPage /> },
      { path: '/test', element: <TestPage /> },
      { path: '/counter', element: <Counter /> },
      { path: '/use-storage', element: <UseStorage /> },
      { path: '/infinite-canvas', element: <InfiniteCanvas /> },
    ]
  },
]);

export default router;