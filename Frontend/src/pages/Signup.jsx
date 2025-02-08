import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heading } from '../components/Heading';
import { InputBox } from '../components/InputBox';
import { Button } from '../components/Button';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import Loadspinner from '../components/Loadspinner';
const Signup = () => {

  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {

    if (!firstname || !lastname || !email || !password) {
      setError("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/user/signup`, {
        name: firstname + " " + lastname,
        email: email,
        password: password
      })
      if (!response) {
        alert("Error")
      }
      else {
        const jwt = response.data;
        localStorage.setItem("token", jwt);
        setLoading(false);
        navigate("/home")
      }
    }
    catch (e) {

      alert("Error while signing up");
      setFirstname('');
      setLastname('');
      setEmail('');
      setPassword('');

    }
    finally {

      setLoading(false);
    }
  };


  return (
    <div className='h-screen bg-custom-teal flex justify-center items-center'>
      {loading && <div>
        <div className='absolute inset-0 bg-gray-800 opacity-90 z-10'></div>
        <div className='relative left-24 bottom-8 z-50'>
          <Loadspinner />
        </div></div>}
      <div className='absolute top-0 left-0 flex flex-row items-center justify-center'>

        <img src=" /blog2.png" alt="" className='w-32' />
        <div className='text-white text-4xl font-bold font-sans -ml-5'>Bold Narratives</div>
      </div>
      <div className='h-3/4 w-96 text-center shadow-md rounded-md bg-custom-white flex  flex-col'>
        <div className='flex justify-center flex-col items-center'>
          <Heading label={"Sign up"} />
          <div className='p-4 text-slate-500'>Enter you information to create an account </div>
        </div>
        <InputBox label={"First Name"} place={"Aditya"} value={firstname} onChange={(e) => {
          setFirstname(e.target.value);
        }} />
        <InputBox label={"Last Name"} place={"G"} value={lastname} onChange={(e) => {
          setLastname(e.target.value);
        }} />
        <InputBox label={"Email"} place={"aditya@gmail.com"} value={email} onChange={(e) => {
          setEmail(e.target.value);
        }} />
        <InputBox label={"Password"} place={"Password"} value={password} onChange={(e) => {
          setPassword(e.target.value);
        }} />
        <Button label={"Sign Up"} onClick={handleSignup} />

        <div>
          Already have an account? <Link to={"/signin"} className=' underline'>Signin</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
