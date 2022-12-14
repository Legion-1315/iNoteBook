import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

//useNavigate hook is used instead of useHisory for latest versions of react > 6.0^

const Login = () => {
    let navigate = useNavigate();
    const host = "http://localhost:5000";
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email:credentials.email, password:credentials.password })
        });
          const json = await response.json();
        console.log(json);
        if (json.success) {
            //save the auth-token and redirect
            localStorage.setItem('token', json.authToken);
            // localStorage.setItem('token', JSON.stringify(json.authToken));
            alert('Logged in Successfully');
            navigate('/');
        }
        else {
          alert('Invalid credentials');
        }
    }
    
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      };

  return (
    <div>
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" value={credentials.email} onChange={onChange} className="form-control" id="email" name='email' aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" value={credentials.password} onChange={onChange} className="form-control" name='password' id="password"/>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Login
