
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/welcome.js";
import CustomerRegister from './pages/Customer/customerRegister';
import EmployeeRegister from './pages/Employee/employeeRegister';
import ManagerRegister from './pages/Manager/managerRegister';
import CustomerMain from './pages/Customer/CustomerDashboard/Dashboard';
import CustomerAccount from './pages/Customer/CustomerAccount/Dashboard';
import CustomerReservations from './pages/Customer/CustomerReservations/Dashboard';
import CustomerReserve from './pages/Customer/CustomerReserve/Dashboard';
import CustomerStats from './pages/Customer/CustomerStats/Dashboard';
import EmployeeMain from './pages/Employee/EmployeeDashboard/Dashboard';
import ManagerMain from './pages/Manager/ManagerDashboard/Dashboard';
import FacilityForm from './pages/Manager/FacilityForm/Dashboard';
import ManagerAccount from './pages/Manager/ManagerAccount/Dashboard';
import ManagerCreateAccount from './pages/Manager/ManagerCreateAccount/Dashboard';
import ManagerCreateEvent from './pages/Manager/ManagerCreateEvent/Dashboard';
import FacilityReservations from './pages/Manager/FacilityReservations/Dashboard';
import ManagerNotes from './pages/Manager/ManagerNotes/Dashboard';
import CustomerSignIn from './pages/Customer/customerSignIn';
import CustomerSubmit from './pages/Customer/CustomerSubmit/Dashboard';
import RequestForm from './pages/Customer/RequestForm/Dashboard';
import EmployeeSignIn from './pages/Employee/employeeSignIn';
import ManagerSignIn from './pages/Manager/managerSignIn';
import CustomerVerify from './pages/Customer/customerVerify';
import EmployeeVerify from './pages/Employee/employeeVerify';
import ManagerVerify from './pages/Manager/managerVerify';
import CustomerForgotPassword from './pages/Customer/customerForgotPassword';
import FacilityHomepage from './pages/Customer/FacilityHomepage/Dashboard';
import EmployeeForgotPassword from './pages/Employee/employeeForgotPassword';
import ManagerForgotPassword from './pages/Manager/managerForgotPassword';
import CustomerConfirmAccount from './pages/Customer/customerConfirmAccount';
import ManagerConfirmAccount from './pages/Manager/managerConfirmAccount';
import EmployeeReservations from './pages/Employee/EmployeeReservations/Dashboard';
import ManagerEditForm from './pages/Manager/ManagerEditForm/Dashboard';
import ManagerCalendar from './pages/Manager/ManagerCalendar/Dashboard';
import EmailChangeForm from './pages/Customer/emailChangeForm';
import EmployeeAccount from './pages/Employee/EmployeeAccount/Dashboard';
import EmployeeEditForm from './pages/Employee/EmployeeEditForm/Dashboard';
import EmployeeCalendar from './pages/Employee/EmployeeCalendar/Dashboard';
import ManagerManageEmployees from './pages/Manager/ManagerManageEmployees/Dashboard';
import ViewShifts from './pages/Manager/ManagerViewShifts/Dashboard';
import ChangePermissions from './pages/Manager/ManagerChangePermissions/Dashboard';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/customerRegister" element={<CustomerRegister />} />
          <Route path="/customerConfirmAccount" element={<CustomerConfirmAccount />} />
          <Route path="/managerRegister" element={<ManagerRegister />} />
          <Route path="/managerConfirmAccount" element={<ManagerConfirmAccount />} />
          <Route path="/employeeRegister" element={<EmployeeRegister />} />
          <Route path="/customerMain" element={<CustomerMain />} />
          <Route path="/customerSubmit" element={<CustomerSubmit />} />
          <Route path="/customerReservations" element={<CustomerReservations />} />
          <Route path="/facilityHomepage" element={<FacilityHomepage />} />
          <Route path="/requestForm" element={<RequestForm />} />
          <Route path="/customerReserve" element={<CustomerReserve />} />
          <Route path="/customerAccount" element={<CustomerAccount />} />
          <Route path="/customerStats" element={<CustomerStats />} />
          <Route path="/employeeMain" element={<EmployeeMain />} />
          <Route path="/managerMain" element={<ManagerMain />} />
          <Route path="/managerManageEmployees" element={<ManagerManageEmployees />} />
          <Route path="/FacilityForm" element={<FacilityForm />} />
          <Route path="/managerCreateEvent" element={<ManagerCreateEvent />} />
          <Route path="/managerEditForm" element={<ManagerEditForm />} />
          <Route path="/facilityReservations" element={<FacilityReservations />} />
          <Route path="/managerAccount" element={<ManagerAccount />} />
          <Route path="/managerNotes" element={<ManagerNotes />} />
          <Route path="/managerCreateAccount" element={<ManagerCreateAccount />} />
          <Route path="/customerSignIn" element={<CustomerSignIn />} />
          <Route path="/employeeSignIn" element={<EmployeeSignIn />} />
          <Route path="/managerSignIn" element={<ManagerSignIn />} />
          <Route path="/customerVerify" element={<CustomerVerify />} />
          <Route path="/employeeVerify" element={<EmployeeVerify />} />
          <Route path="/managerVerify" element={<ManagerVerify />} />
          <Route path="/customerChangePassword" element={<CustomerForgotPassword />} />
          <Route path="/employeeChangePassword" element={<EmployeeForgotPassword />} />
          <Route path="/managerChangePassword" element={<ManagerForgotPassword />} />
          <Route path="/employeeReservations" element={<EmployeeReservations />} />
          <Route path="/Calendar" element={<ManagerCalendar />} />
          <Route path="/emailChangeForm" element={<EmailChangeForm />} />
          <Route path="/employeeAccount" element={<EmployeeAccount />} />
          <Route path="/employeeEditForm" element={<EmployeeEditForm />} />
          <Route path="/employeeCalendar" element={<EmployeeCalendar />} />
          <Route path="/managerViewShifts" element={<ViewShifts />} />
          <Route path="/managerChangePermissions" element={<ChangePermissions />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
