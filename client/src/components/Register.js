import React,{useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/icons8-shield-96.png';
import doclogo from '../assets/image 12.png';

const Register = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    hospitalRegistrationDate: '',
    numberOfAmbulanceAvailable: '',
    email: '',
    phoneNo: '',
    hospitalRegistrationNo: '',
    emergencyWardNo: '',
    // certificateUpload: '',
    password: '',
    confirmPassword: '',
  });

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    let errorMessage = '';
  if (
    formData.hospitalName.trim() === '' ||
    formData.address.trim() === '' ||
    formData.city.trim() === '' ||
    formData.state.trim() === '' ||
    formData.pincode.trim() === '' ||
    formData.hospitalRegistrationDate.trim() === '' ||
    formData.email.trim() === '' ||
    formData.phoneNo.trim() === '' ||
    formData.hospitalRegistrationNo.trim() === '' ||
    formData.emergencyWardNo.trim() === '' ||
    formData.password.trim() === '' ||
    formData.confirmPassword.trim() === ''
  ) {
    errorMessage = 'All fields are required.';
  } else {
    // Email validation using a regular expression
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      errorMessage = 'Invalid email address.';
    }

    // Phone number validation using a regular expression
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNo)) {
      errorMessage = 'Invalid phone number.';
    }

    // Check if "Number of Ambulances Available" is a number
    if (isNaN(formData.numberOfAmbulanceAvailable)) {
      errorMessage = 'Number of Ambulances must be a number.';
    }

    if (formData.password !== formData.confirmPassword) {
      errorMessage = 'Password and Confirm Password do not match.';
    }
  }

  // Display the error message using alert
  if (errorMessage !== '') {
    alert(errorMessage);
    return;
  }

   
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Response from the server
        if(data.error){
          alert(data.error);
        }
        else{
          alert(data.message)
        }
        navigate('/login',{replace:true})
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error:', error)
        
      });
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
            <Link to='/' className='signup' style={{ textDecoration: 'none' }}>Sign Up</Link>
            <span className='login'>/</span>
            <Link className='login' to='/login' style={{ textDecoration: 'none' }}>Login</Link>
          </div>
        </div>

        <form className='form'>
        <div className='left-column'>
          <input
            type='text'
            name='hospitalName'
            placeholder='Hospital Name'
            value={formData.hospitalName}
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='address'
            placeholder='Address'
            value={formData.address}
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='city'
            placeholder='City'
            value={formData.city}
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='state'
            placeholder='State'
            value={formData.state}
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='pincode'
            placeholder='Pincode'
            value={formData.pincode}
            onChange={handleInputChange}
          />
          <input
            type='date'
            name='hospitalRegistrationDate'
            placeholder='Hospital Registration Date'
            value={formData.hospitalRegistrationDate}
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='numberOfAmbulanceAvailable'
            placeholder='Number of Ambulances Available'
            value={formData.numberOfAmbulanceAvailable}
            onChange={handleInputChange}
          />
        </div>

        <div className='right-column'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type='tel'
            name='phoneNo'
            placeholder='Phone Number'
            value={formData.phoneNo}
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='hospitalRegistrationNo'
            placeholder='Hospital Registration No'
            value={formData.hospitalRegistrationNo}
            onChange={handleInputChange}
          />
          <input
            type='text'
            name='emergencyWardNo'
            placeholder='Emergency Ward No'
            value={formData.emergencyWardNo}
            onChange={handleInputChange}
          />
           <input
            type='file'
            id='certificateUpload'
            name='certificateUpload'
            value={formData.certificateUpload}
            disabled
            // onChange={handleInputChange}
          /><p>dummy no need of file</p>
          <input
            type='password'
            name='password'
            placeholder='Create Password'
            value={formData.password}
            onChange={handleInputChange}
          />
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>

        <button onClick={handleSubmit} type='submit' >Submit</button>
      </form>
      <p className='footer'>Terms and conditions privacy policy</p>
      </div>
    </div>
  );
};
export default Register;