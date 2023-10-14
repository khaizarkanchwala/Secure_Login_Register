// Capture.js
import React, { useState,useEffect } from 'react';
import { Link,useNavigate} from 'react-router-dom';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
import '../App.css';
import logo from '../assets/icons8-shield-96.png';
import doclogo from '../assets/image 12.png';

const Capture = () => {
  const [imageSrc, setImageSrc] = useState('');
  const webcamRef = React.useRef(null);
  const [isRetake, setIsRetake] = useState(false); // Track whether to show Retake/OK buttons
  const navigate=useNavigate();
  const [userId, setUserId] = useState('');
  const [loading,setLoading]=useState(0);
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
          console.log('Unauthorized');
          // navigate('/login',{replace:true})
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
  const captureImage = () => {
    const webcamElement = webcamRef.current.video;

    html2canvas(webcamElement, { useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      setImageSrc(imgData);
      setIsRetake(true); // Show Retake/OK buttons after capturing
    });
  };

  const resetImage = () => {
    setImageSrc("");
    setIsRetake(false); // Hide Retake/OK buttons when retaking
  };

  const handleOk = async() => {
    // const formData = new FormData();
    // formData.append({'image':imageSrc});
    setLoading(1)
    await fetch('/api/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        email: userId,
        image: imageSrc,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          // Image successfully saved in MongoDB
          console.log('Image saved in MongoDB');
          navigate(`/display/${userId}`,{replace:true})
          // You can add further actions here if needed
        } else {
          // Handle the case where the image upload failed
          console.error('Image upload failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      
  };
  if(!loading){
  return (
    <div className="App">
      <div className="bg">
        <div className="leftdiv">
          <img src={logo} alt="logo" className="logo" />
          <p className="white">
            Feel <span className="green">Safe</span> Everywhere
          </p>
          <p className="smallwhite">
            #Safe-<span className="smallgreen">T</span>-First
          </p>
        </div>
      </div>

      <div className="form-container">
        <div className="logodocdiv">
          <img src={doclogo} alt="logo" />
          <div className="links" style={{ whiteSpace: 'nowrap' }}>
            <Link to="/" className="login" style={{ textDecoration: 'none' }}>
              Sign Up
            </Link>
            <span className="signup">/</span>
            <Link
              className="signup"
              to="/login"
              style={{ textDecoration: 'none' }}
            >
              Login
            </Link>
          </div>
        </div>
        <div className="capture">
          <p className="capturetitle">Please Capture your face to continue {userId}</p>
          <div className="camcardpadding">
            <div className="camcard">
              {imageSrc ? (
                <div>
                  <img
                    src={imageSrc}
                    alt="Captured"
                    className="captureimage"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                  {isRetake ? (
                    <div>
                      <button onClick={resetImage} className='cambutton'>Retake</button>
                      <button onClick={handleOk} className='cambutton'>OK</button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div>
                  <Webcam
                    ref={webcamRef}
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                  <button onClick={captureImage}>Capture</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="footer">Terms and conditions privacy policy</p>
      </div>
    </div>
  );
}
else{
  return (
    <div className="registration-container">Loading...
    <div id='loop' className='center'></div>
      <div id="bike-wrapper" className="center" >
        <div id="bike" className='centerBike'></div>
      </div>
    </div>
  )
}
};

export default Capture;
