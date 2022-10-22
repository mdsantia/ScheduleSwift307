
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
import ManagerAccount from './pages/Manager/ManagerAccount/Dashboard';
import ManagerCreateAccount from './pages/Manager/ManagerCreateAccount/Dashboard';
import ManagerCreateReservation from './pages/Manager/ManagerCreateReservation/Dashboard';
import ManagerNotes from './pages/Manager/ManagerNotes/Dashboard';
import CustomerSignIn from './pages/Customer/customerSignIn';
import EmployeeSignIn from './pages/Employee/employeeSignIn';
import ManagerSignIn from './pages/Manager/managerSignIn';
import CustomerVerify from './pages/Customer/customerVerify';
import EmployeeVerify from './pages/Employee/employeeVerify';
import ManagerVerify from './pages/Manager/managerVerify';
import CustomerForgotPassword from './pages/Customer/customerForgotPassword';
import EmployeeForgotPassword from './pages/Employee/employeeForgotPassword';
import ManagerForgotPassword from './pages/Manager/managerForgotPassword';
import CustomerConfirmAccount from './pages/Customer/customerConfirmAccount';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/customerRegister" element={<CustomerRegister />} />
          <Route path="/customerConfirmAccount" element={<CustomerConfirmAccount />} />
          <Route path="/managerRegister" element={<ManagerRegister />} />
          <Route path="/employeeRegister" element={<EmployeeRegister />} />
          <Route path="/customerMain" element={<CustomerMain />} />
          <Route path="/customerReservations" element={<CustomerReservations />} />
          <Route path="/customerReserve" element={<CustomerReserve />} />
          <Route path="/customerAccount" element={<CustomerAccount />} />
          <Route path="/customerStats" element={<CustomerStats />} />
          <Route path="/employeeMain" element={<EmployeeMain />} />
          <Route path="/managerMain" element={<ManagerMain />} />
          <Route path="/managerCreateReservation" element={<ManagerCreateReservation />} />
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
