import React, { useState, useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import logo from '../assets/icons8-shield-96.png';
import logotext from '../assets/image 12.png';

const DisplayData = () => {
  let {email}=useParams()
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]); // Store the original data
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userimage, setUserImage] = useState('');
  const columns = [
    'hospitalName',
    'address',
    'city',
    'state',
    'pincode',
    'hospitalRegistrationDate',
    'numberOfAmbulanceAvailable',
    'email',
    'phoneNo',
    'hospitalRegistrationNo',
    'emergencyWardNo',
  ];

  useEffect(() => {
    const fetchData = async () => {
      fetch('/api/displaydata') // Replace with the actual API endpoint
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setOriginalData(data); // Store the original data
        })
        .catch((error) => console.error('Error fetching data:', error));
    };

    const fetchimage = async () => {
      // console.log(email)
        await fetch(`/api/imageget?email=${email}`,{
          method:"GET",
        }).then((res)=> res.json()).then((data)=>{console.log(data)
        setUserImage(data.data)})
    };



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
          navigate('/login', { replace: true });
        } else {
          // Handle other errors
          console.log('Error');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        // Handle network error
        // console.error(error);
        // console.log('Network Error');
        navigate('/login', { replace: true });
      }
    };
    fetchProtectedData();
    fetchimage();
    fetchData();

  },[email,navigate]);

  const logout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials for cookies
      });

      if (response.status === 200) {
        alert('Logout successful');
        navigate('/login', { replace: true });
      } else {
        console.log('Logout failed');
      }
    } catch (error) {
      console.error(error);
      console.log('Network Error');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/hospitals?name=${searchQuery}`);
      if (response.ok) {
        const searchData = await response.json();
        setData(searchData); // Update the data with search results
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Network Error', error);
    }
  };

  const resetSearch = () => {
    // Reset the data to the original data
    setData(originalData);
    // Clear the search query
    setSearchQuery('');
  };

  return (
    <div>
      <div className="navbar">
        <img src={logo} alt="logo" className="navlogo" />
        <img src={logotext} alt="logo" className="navtext" />
        <img src={userimage} alt="logo" className="profilelogo" />
        <div className="textpaddingnav">
          <b className="textnavbar">{userId}</b>
          <div className="navbutton">
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
      <div>
        <p className="displaytext">Hospital Registrations</p>
        <div className="paddingsearch">
          <input
            type="text"
            name="hospitalName"
            placeholder="Hospital Name"
            className="searchtext"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="searchbuttonpadding">
          <button onClick={handleSearch}>Search</button>
          <button onClick={resetSearch}>Reset</button> {/* Add a reset button */}
        </div>
      </div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayData;
