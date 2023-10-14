import React, { useEffect,useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/icons8-shield-96.png';
import doclogo from '../assets/image 12.png';
import camers from '../assets/mdi_camera.png'

const WebCamp = () => {
  const navigate=useNavigate();
  const [userId, setUserId] = useState('');

  useEffect(() => { 
    const fetchProtectedData = async () => {
      try {
        const response = await fetch('/api/protected', {
          method: 'GET',
          credentials: 'include', // Include credentials for cookies
        });
        if (response.status === 200) {
          const data = await response.json();
          // console.log(data.message);
          setUserId(data.userId); // Set the userId received from the server
        } else if (response.status === 401) {
          // Handle authentication error, e.g., redirect to login
          // console.log('Unauthorized');
          navigate('/login',{replace:true})
        } else {
          // Handle other errors
          // console.log('Error');
          navigate('/login',{replace:true})
        }
      } catch (error) {
        // Handle network error
        // console.error(error);
        // console.log('Network Error');
        navigate('/login',{replace:true})
      }
    };

    fetchProtectedData();
   },[navigate])
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
        <div className='capture'>
        <p className='capturetitle'>Please Capture your face to continue {userId}</p>
        <div className='camcardpadding'>
        <div className='camcard'>
        <img src={camers} alt='logoname' className='camimage' />
        </div>
        </div>
        <div className='paddingbutton'>
          <Link to='/capture'>
        <button  className='submit-button'>
          Capture
        </button>
        </Link>
        </div>
        </div>
        <p className='footer'>Terms and conditions privacy policy</p>
      </div>
    </div>
  )
}

export default WebCamp