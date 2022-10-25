import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  let navigate = useNavigate();
  const host = 'http://localhost:5000';
  const [credentials, setCredentials] = useState({name:'', email: '', password: '',cpassword:'' });
  
  const handleSubmit = async (e) =>
  {
    const { name, email, password } = credentials;
      e.preventDefault();
      const response = await fetch(`${host}/api/auth/createuser`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
        body: JSON.stringify({ name, email, password })
      });
        const json = await response.json();
      console.log(json);
      if (json.success) {
          //save the auth-token and redirect
          localStorage.setItem('token', json.authToken);
        navigate('/');
        alert('Logged in Success');
        
      }
      else {
        alert('Logged out');
      }
  }
  
  const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

  return (
    <div>
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="name" className="form-label">Name</label>
    <input onChange={onChange} type="text" name='name' className="form-control" id="name" aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input onChange={onChange} type="email"  required name='email' className="form-control" id="email" aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input onChange={onChange} minLength='8' required type="password" name='password' className="form-control" id="password"/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
    <input onChange={onChange} minLength='8' required type="password" name='cpassword' className="form-control" id="cpassword"/>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default SignUp
