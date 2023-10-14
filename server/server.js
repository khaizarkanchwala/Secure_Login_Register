import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { capture } from './models/captureimageModel.js';
import { registration } from './models/registrationModel.js'; // Import the registration model
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import {jobs} from './cron.js'

jobs.start();
dotenv.config()
const app = express();
const port = process.env.PORT || 8000;
// MongoDB Atlas connection string (replace with your own)
const secretKey =process.env.SECRET_KEY;

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Middleware for parsing JSON data
app.use(bodyParser.urlencoded({extended:true,parameterLimit:100000,limit:"500mb"}))
app.use(bodyParser.json({limit: '500mb' }));
app.use(cookieParser());

const verifyToken = async(req, res, next) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify (token, secretKey, async(err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Token is valid, store the decoded data (e.g., userId) in the request object
    req.userId = decoded.userId;
    const user= await registration.findOne({_id:decoded.userId})
    const email=user.email
    req.email=email
    next();
  });
};

app.get('/api',async(req,res)=>{
  console.log('server running to restart')
  try {
    res.status(200).send('Server restart successful');
  } catch (error) {
    console.error('Error during server restart:', error);
    res.status(500).send('Server restart failed');
  }
})
// Create a route to handle saving data to MongoDB
app.post('/api/register', async(req, res) => {
  const formData = req.body; // Data sent from the client
  const email=formData.email
  const hospitalName=formData.hospitalName
  const userExist=await registration.findOne({hospitalName})
  const emailExist=await registration.findOne({email})
  if(userExist || emailExist){
    return res.status(422).json({error:"Email exist or hospital registered already"})
  }
  else{
  const hospital = new registration(formData);

  hospital.save()
    .then(() => {
      res.status(200).json({ message: 'Hospital data saved successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { hospitalName, email, password } = req.body;

    // Find the user in the database based on hospitalName and email
    const user = await registration.findOne({ hospitalName, email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    res.cookie('jwtToken', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/protected', verifyToken, async(req, res) => {
  const userId = req.email;
  res.json({ message: 'Access granted', userId});
});

app.get('/api/displaydata', async (req, res) => {
  try {
    const hospitals = await registration.find();
    res.json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('jwtToken');
  res.status(200).json({ message: 'Logout successful' });
});

app.get('/api/hospitals', async (req, res) => {
  try {
    const { name } = req.query;
    const hospitals = await registration.find({
      hospitalName: { $regex: new RegExp(name, 'i') }, // Case-insensitive search
    });
    res.json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post("/api/image", async (req, res) => {
  const formData = req.body;
  const email = formData.email;
  const image = formData.image;

  // Check if an entry with the given email already exists
  const emailExist = await capture.findOne({ email });

  if (emailExist) {
  //   // If the email exists, update the image for that email
    await capture.findOneAndUpdate({ email }, { image });
    res.status(200).send('Image updated successfully');
  } else {
    // If the email doesn't exist, create a new record
    const newCaptureImage = new capture({
      email,
      image
    });

    await newCaptureImage.save();
    res.status(200).send('Image uploaded and saved');
  }
})


app.get('/api/imageget', async (req, res) => {
  const {email} = req.query;
  // console.log(email)
  // Find a document by email
  const user = await capture.findOne({ email });
  // console.log(user)

  if (user) {
    const imageBuffer = user.image; // Assuming you store the image as a binary buffer in the 'image' field
    res.send({status:"ok",data:imageBuffer});
  } else {
    // Handle the case when the email doesn't exist
    res.status(404).json({ error: 'Image not found' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
