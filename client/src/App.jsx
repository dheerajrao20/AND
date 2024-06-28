import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Student from './components/Student';
import Interview from './components/Interview';
import Company from './components/Company';
import AddStudent from './components/AddStudent';
import StudentListByBranch from './components/StudentListByBranch';
import AddCompany from './components/AddCompany';
import HiringRound from './components/HiringRound';
import AddRound from './components/AddRound';
import Start from './components/Start';
import PrivateRoute from './components/PrivateRoute';
import CGPAFilter from './components/CGPAFilter';
import FirstRound from './components/FirstRound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route path="" element={<Home />} />
          <Route path="/dashboard/student" element={<Student />} />
          <Route path="/dashboard/interview" element={<Interview />} />
          <Route path="/dashboard/company" element={<Company />} />
          <Route path="/dashboard/add_student" element={<AddStudent />} />
          <Route path="/dashboard/student/branch" element={<StudentListByBranch />} />
          <Route path="/dashboard/student/CGPA" element={<CGPAFilter />} />
          <Route path="/dashboard/add_company" element={<AddCompany />} />
          <Route path="/dashboard/interview/:companyName/add_round" element={<AddRound />} />
          <Route path="/dashboard/interview/:companyName/first_round" element={<FirstRound />} />
          <Route path="/dashboard/interview/:companyName" element={<HiringRound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
