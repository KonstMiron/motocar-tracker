import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Header } from '../../widgets/header';
import { HomePage } from '../../pages/home';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <HomePage />
      </>
    ),
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;