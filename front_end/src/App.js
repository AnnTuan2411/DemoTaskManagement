import React from 'react';
import LoginForm from "./compoments/LoginForm/LoginForm"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeManagement from './compoments/ManageEmployee/EmployeeManagement';
import EtaskManagement from './compoments/ManageEtask/EtaskManagement';
import EmployeeTask from './compoments/EmployeeTask/EmployeeTask';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/employee-managment" element={<EmployeeManagement />} />
        <Route path="/etask-managment" element={<EtaskManagement />} />
        <Route path="/etask-list" element={<EmployeeTask />} />
      </Routes>
    </Router>
  );
}

export default App;
