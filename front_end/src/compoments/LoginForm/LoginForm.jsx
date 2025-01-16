import React, { useState } from 'react'
import './LoginForm.css'
import { FaUser, FaLock } from "react-icons/fa"
import { useNavigate } from 'react-router-dom';
import { getEmployees } from "../service/employeeservice";
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      const response = await getEmployees();
  
      const employee = response.find(
          (emp) => emp.username === username && emp.password === password
      );
  
      if (employee) {
  
        sessionStorage.setItem('employee_id', employee.employee_id);
        sessionStorage.setItem('role_id', employee.role_id);
        sessionStorage.setItem('fullname', employee.fullname);
        if(employee.role_id === 1){
          navigate('/employee-managment');
        }else if(employee.role_id === 2){
          navigate('/etask-list');
        }
          
      } else {
          // Nếu không tìm thấy, hiển thị cảnh báo
          alert('Sai tên đăng nhập hoặc mật khẩu!');
      }
    }catch(error){
      console.error("Lỗi khi đăng nhập:", error);
    }
    
  };
  return (
    <div className='wrapper'>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="UserName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Pasword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
          <FaLock className="icon" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm
