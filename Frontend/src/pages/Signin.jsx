import React, { useState } from 'react';
import { Heading } from '../components/Heading';
import { InputBox } from '../components/InputBox';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import Loadspinner from '../components/Loadspinner';

const Signin = () => {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    const handleSignin = async () => {
        setLoading(true);
       try{
        if (!email || !password) {
            setError("All fields are required");
            return;
        }
        const response= await axios.post(`${BACKEND_URL}/api/user/signin`,{
            email:email,
            password:password
        })
        if(response.status===403){
            alert("Invalid Email/password");

        }
        else
        {

            const jwt =response.data;
            localStorage.setItem("token",jwt);
            setLoading(false);
            navigate("/home")
        }
       }
       catch(e){

        alert("Error while signing in");
        setEmail('');
        setPassword('')
       }
       finally{
        setLoading(false);
       }
    };

    return (
        <div>
            <div className='h-screen  bg-custom-teal flex justify-center items-center '>
                {loading&&<div>
                    <div className='absolute inset-0 bg-gray-800 opacity-90 z-10'></div>
                    <div className='relative left-24 bottom-8 z-50'>
                        <Loadspinner/>
                </div></div>}
                <div className='absolute top-0 left-0 flex flex-row items-center justify-center'>
                    
                    <img src=" /blog2.png" alt="" className='w-32' />
                    <div className='text-white text-4xl font-bold font-sans -ml-5'>Bold Narratives</div>
                </div>
                <div className='h-1/2 w-96 text-center shadow-md rounded-md bg-white flex  flex-col'>
                    <div className='flex justify-center flex-col items-center'>
                        <Heading label={"Sign In"} />
                        <div className='p-4 text-slate-500'>Enter you information to create to Log in  </div>
                    </div>
                    
                    <InputBox label={"Email"} place={"aditya@gmail.com"} value={email} onChange={(e) => {
                        setEmail(e.target.value)
                    }} />
                    <InputBox label={"Password"} place={"Password"} value={password} onChange={(e) => {
                        setPassword(e.target.value)
                    }} />
                    <Button label={"Sign In"} onClick={handleSignin} />

                    <div>
                        Already have an account? <Link to={"/signup"} className=' underline'>Signup</Link>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Signin;
