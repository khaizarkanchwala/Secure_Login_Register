import React,{useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/icons8-shield-96.png';
import doclogo from '../assets/image 12.png';

const Login = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorMessage = '';
    if (
      formData.hospitalName.trim() === '' ||
      formData.email.trim() === '' ||
      formData.password.trim() === ''
    ) {
      errorMessage = 'All fields are required.';
    }
    if (errorMessage !== '') {
      alert(errorMessage);
      return;
    }
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        alert("Login successful")
        navigate('/cam',{replace:true})
      } else {
        // Handle login failure (e.g., display an error message)
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  return (
    <div className='App'>
      <div className='bg'>
        <div className='leftdiv'>
          <img src={logo} alt='logo' className='logo' />
          <p className='white'>Feel <span className='green'>Safe</span> Everywhere</p>
          <p className='smallwhite'>#Safe-<span className='smallgreen'>T</span>-First</p>
        </div>
      </div>

      <div className='form-container'>
        <div className='logodocdiv'>
          <img src={doclogo} alt='logo' />
          <div className='links' style={{ whiteSpace: 'nowrap' }}>
            <Link to='/' className='login' style={{ textDecoration: 'none' }}>Sign Up</Link>
            <span className='signup'>/</span>
            <Link className='signup' to='/login' style={{ textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
        <div className='cardpadding'>
        <div className='card'>
            <p className='titlesicu'>Welcome to Demo Registration</p>
            <p className="belowsicu">Your one stop safety solutions using innovative technology</p>
            <form  className='loginform'>
          <input
            type='text'
            name='hospitalName'
            placeholder='Hospital Name'
            value={formData.hospitalName}
            onChange={handleInputChange}
            required
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type='text'
            name='accessCode'
            placeholder='Special Access Code(dummy)'
            value={formData.accessCode}
            onChange={handleInputChange}
            disabled
            required
          />
        </form>
        </div>
        </div>
        
        <div className='paddingbutton'>
        <button onClick={handleSubmit} className='submit-button'>
          Login
        </button>
        </div>
        <p className='footer'>Terms and conditions privacy policy</p>
        </div>
    </div>
  )
}

export default Login