import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import axios from 'axios';

const UserProfile = ({ userId }) => {
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo,setUserInfo] = useState({})
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    useEffect(()=>{
        if(userId){axios.get(`${BACKEND_URL}/api/user/profile?id=${userId}`,{
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        }).then((response)=>{
            setUserInfo(response.data)
        }).catch((err)=>{
            setUserInfo({})
        })}
    },[userId])
    const logout=()=>{
        localStorage.removeItem('token');
          
    }

    return (
        <div className='relative justify-center items-center flex '>
            {/* Profile Icon */}
            <div onClick={toggleDropdown} className='border border-white rounded-full w-10 h-10 flex justify-center items-center cursor-pointer'>
            <svg className='w-8' version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 32 32"  xml:space="preserve"><style></style><path class="st1" d="M25.838 31H6.162a3.957 3.957 0 0 1-3.245-1.661 3.956 3.956 0 0 1-.549-3.604l.704-2.113a6.034 6.034 0 0 1 4.966-4.059C10.131 19.307 13.211 19 16 19c2.788 0 5.869.307 7.963.563a6.032 6.032 0 0 1 4.965 4.059l.704 2.113a3.954 3.954 0 0 1-.55 3.604A3.955 3.955 0 0 1 25.838 31zM16 21c-2.688 0-5.681.298-7.718.549a4.02 4.02 0 0 0-3.312 2.706l-.704 2.112c-.206.618-.106 1.274.274 1.802S5.511 29 6.162 29h19.676a1.98 1.98 0 0 0 1.622-.83c.381-.528.48-1.185.275-1.803l-.704-2.112a4.02 4.02 0 0 0-3.312-2.706C21.681 21.298 18.687 21 16 21zM16 18c-4.687 0-8.5-3.813-8.5-8.5S11.313 1 16 1c4.687 0 8.5 3.813 8.5 8.5S20.687 18 16 18zm0-15c-3.584 0-6.5 2.916-6.5 6.5S12.416 16 16 16s6.5-2.916 6.5-6.5S19.584 3 16 3z"/><path d="M12.04 10.54c-.543 0-.988-.435-1-.98a4.964 4.964 0 0 1 1.394-3.564 4.968 4.968 0 0 1 3.505-1.535c.562.01 1.009.428 1.02.98a1 1 0 0 1-.98 1.02 2.982 2.982 0 0 0-2.103.92 2.981 2.981 0 0 0-.836 2.139 1 1 0 0 1-.98 1.02h-.02z" /></svg>
            </div>

            {/* User Name */}
            <div className='font-bold text-white px-3'>{userInfo.response?.name}</div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className='absolute top-full left-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg'>
                    <div className='px-4 py-2 border-b'>
                        <strong>Followers:</strong> {userInfo.response?.follower?.length||0}
                    </div>
                    <div className='px-4 py-2 border-b'>
                        <strong>Following:</strong> {userInfo.response?.following?.length ||0}
                    </div>
                    <div className='px-4 py-2'>
                        <strong>Email:</strong>{(userInfo.response?.email)}
                    </div>
                    <div className='px-4 py-2 '>
                       <Link to={'/'}>
                        <button className='border border-black rounded-lg p-1 bg-red-600 text-white' onClick={logout}><strong>Logout</strong></button>
                       </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;