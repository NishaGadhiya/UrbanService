import './App.css';
import { Sidebar } from './component/Sidebar';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Login } from './component/Login';
import { Signup } from './component/Signup';
import { ServiceProviderDashboard } from './component/serviceprovider/ServiceProviderDashboard';
import { UserDashboard } from './component/user/UserDashboard';
import { AddService } from './component/serviceprovider/AddService';
import { UpdateService } from './component/serviceprovider/UpdateService';
import { BookingManagement } from './component/serviceprovider/BookingManagement';
import { ProtectedRoutes } from './hooks/ProtectedRoutes';
import { Error404 } from './component/Error404';
import { AllServices, BookService } from './component/user/BookService';
import { MyBookings } from './component/user/MyBookings';
import { FetchDetails } from './component/user/FetchDetails';
import { MyServices } from './component/serviceprovider/MyServices';
import { Servicedetails } from './component/serviceprovider/Servicedetails';
import { ServiceList } from './component/serviceprovider/ServiceList';
import { Payment } from './component/Payment';
import { ServiceProviderRegister } from './component/serviceprovider/ServiceProviderRegister';
import { UserRegistration } from './component/user/UserRegistration';
import { ServiceProviderProfile } from './component/serviceprovider/Profile';
import { UserProfile } from './component/user/Profile';
import { BookServiceDetails } from './component/user/BookServiceDetails';
import { Registration } from './component/Registration';
import { MainPage } from './component/MainPage';
import { Logout } from './component/Logout';
import { ForgotPassword } from './component/ForgotPassword';
import { ResetPassword } from './component/ResetPassword';
import { AddAddress } from './component/AddAddress';
import PaymentDemo from './component/PaymentDemo';
import { PublicRoutes } from './hooks/PublicRoutes';
import { AdminLogin } from './component/admin/AdminLogin';
import { AdminDashboard } from './component/admin/AdminDashboard';
import { AdminProfile } from './component/admin/AdminProfile';
import { AddCategory } from './component/admin/AddCategory';
import { MyCategories } from './component/admin/MyCategories';
import { UpdateCategory } from './component/admin/UpdateCategory';
import { AddSubcategory } from './component/admin/AddSubcategory';
import { MySubcategories } from './component/admin/MySubcategories';
import { UpdateSubcategory } from './component/admin/UpdateSubcategory';
import { Users } from './component/admin/Users';
import { ServiceProvider } from './component/admin/ServiceProvider';
import { AdminLogout } from './component/admin/AdminLogout';

function App() {
  const location = useLocation();

  // Define paths where the sidebar should NOT be shown
  const noSidebarPaths = [
    "/", "/login", "/forgotpassword", "/resetpassword",
    "/registration", "/serviceprovider/registration", "/user/registration", "/signup", "/404","/admin/login",
  ];

  return (
    <div className='g-sidenav-show bg-white-200'>
      {/* Show Sidebar unless the current path is in noSidebarPaths */}
      {!noSidebarPaths.includes(location.pathname) && <Sidebar />}

      <main className='main-content position-relative max-height-vh-100 h-100 border-radius-lg'>
        <div className="container-fluid py">
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes />}>
              <Route path='/' element={<MainPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/forgotpassword' element={<ForgotPassword />} />
              <Route path='/resetpassword' element={<ResetPassword />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/registration' element={<Registration />} />
              <Route path='/serviceprovider/registration' element={<ServiceProviderRegister />} />
              <Route path='/user/registration' element={<UserRegistration />} />
              <Route path='/admin/login' element={<AdminLogin />} />
            </Route>
            <Route path='/logout' element={<Logout />} />

            {/* Protected Routes for user */}
            <Route element={<ProtectedRoutes allowedRoles={["user"]} />}>
              <Route path='/user/dashboard' element={<UserDashboard />} />
              <Route path='/user/profile' element={<UserProfile />} />
              <Route path='/user/bookservices' element={<BookService />} />
              <Route path='/user/bookings' element={<MyBookings />} />
              <Route path='/user/bookservicedetails/:id' element={<BookServiceDetails />} />
              <Route path='/user/fetchdetails/:id' element={<FetchDetails />} />
              <Route path='/user/payment/:id' element={<Payment />} />
              <Route path='/user/paymentdemo/:id' element={<PaymentDemo />} />
              <Route path='/user/dashboard/addAddress' element={<AddAddress />} />
              <Route path='/user/logout' element={<Logout />} />
            </Route>

            {/* Protected Routes for service_provider */}
            <Route element={<ProtectedRoutes allowedRoles={["service_provider"]} />}>
              <Route path='/service_provider/dashboard' element={<ServiceProviderDashboard />} />
              <Route path='/service_provider/profile' element={<ServiceProviderProfile />} />
              <Route path='/service_provider/addservice' element={<AddService />} />
              <Route path='/service_provider/myservices' element={<MyServices />} />
              <Route path='/service_provider/servicelist' element={<ServiceList />} />
              <Route path='/service_provider/update-service/:id' element={<UpdateService />} />
              <Route path='/service_provider/details/:id' element={<Servicedetails />} />
              <Route path='/service_provider/booking-management' element={<BookingManagement />} />
              <Route path='/service_provider/logout' element={<Logout />} />
            </Route>

            <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
              <Route path='/admin/dashboard' element={<AdminDashboard />} />
              <Route path='/admin/profile' element={<AdminProfile />} />
              <Route path='/admin/add-category' element={<AddCategory />} />
              <Route path='/admin/mycategories' element={<MyCategories />} />
              <Route path='/admin/update-category/:id' element={<UpdateCategory />} />
              <Route path='/admin/add-subcategory' element={<AddSubcategory />} />
              <Route path='/admin/mysubcategories' element={<MySubcategories />} />
              <Route path='/admin/manage-users' element={<Users />} />
              <Route path='/admin/manage-serviceProviders' element={<ServiceProvider />} />
              <Route path='/admin/update-subcategory/:id' element={<UpdateSubcategory />} />
              <Route path='/admin/Logout' element={<AdminLogout />} />
            </Route>

            {/* Catch-All Route for 404 */}
            <Route path='/404' element={<Error404 />} />

            {/* Catch-all (for any invalid path) */}
            <Route path='*' element={<Navigate to="/404" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
