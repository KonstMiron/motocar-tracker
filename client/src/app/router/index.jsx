import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Header } from '../../widgets/header';
import { HomePage } from '../../pages/home';
import { LoginPage } from '../../pages/auth/login';
import { RegisterPage } from '../../pages/auth/register';
import { VehiclesPage } from '../../pages/vehicles';
import { VehicleDetailsPage } from '../../pages/vehicleDetails';
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
  {
    path: '/login',
    element: (
      <>
        <Header />
        <LoginPage />
      </>
    ),
  },
  {
    path: '/register',
    element: (
      <>
        <Header />
        <RegisterPage />
      </>
    ),
  },
  {
    path: '/vehicles',
    element: (
      <>
        <Header />
        <VehiclesPage />
      </>
    ),
  },
  {
    path: '/vehicles/:id',
    element: (
      <>
        <Header />
        <VehicleDetailsPage />
      </>
    ),
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;