import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import LoadingBlogs from '../components/LoadingBlogs'
const ProfilePage = ( {userInfo1} ) => {

  const navigate = useNavigate();
  const [userId, setUserId] = useState(0);
  const [isFollowing, setIsFollowing] = useState();
  const [loading,setLoading]=useState(false)
  const [userInfo,setUserInfo]=useState(userInfo1)
  useEffect(() => {
    
    setUserInfo(userInfo1);
}, [userInfo1]);

  useEffect(() => {
    
    axios.get(`${BACKEND_URL}/api/user/getid`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      }
    }).then(response => {
      setUserId(response.data.userId);
    }).catch(err => {
      alert("Your session has expired. Please log in again.");
      console.log(err)
    });
    
  }, [navigate]);
  
  
  useEffect(()=>{
    console.log(userInfo?.response?.id )
    if(userInfo?.userInfo1?.response){
      setLoading(true)
    axios.get(`${BACKEND_URL}/api/user/profile?id=${userInfo?.response?.id }`,{
      headers: {
        Authorization: localStorage.getItem("token"),
      }
    }).then(response=>{
      
      setUserInfo(response.data);
     
      // userInfo=response.data
      setLoading(false);
    }).catch(err=>{
      console.log(err)
      setLoading(false);
    })
    setLoading(false)}
  },[navigate,isFollowing,userInfo1])
  
  const handleFollow = () => {
    console.log(userId)
    console.log(userInfo.response.id)
    const data = {
      targetUserIdParam: userInfo?.response?.id,
    };

    axios.post(`${BACKEND_URL}/api/user/follow`, data,{
      headers: {
        Authorization: localStorage.getItem("token"),
      }
    })
      .then(() =>{ setIsFollowing(true)
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          response: {
            ...prevUserInfo.response,
            followers: [...prevUserInfo.response.followers, { id: userId }] // Add the current user as a follower
          }
        }));
      })
      .catch((error) => console.error('Error following user:', error));
  };

  const handleUnfollow = () => {
    const data = {
      targetUserIdParam: userInfo?.response?.id,
    };

    axios.post(`${BACKEND_URL}/api/user/unfollow`, data,{
      headers: {
        Authorization: localStorage.getItem("token"),
      }
    })
      .then(() => {setIsFollowing(false)
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          response: {
            ...prevUserInfo.response,
            followers: prevUserInfo.response.followers.filter(follower => follower.id !== userId) // Remove the current user from followers
          }
        }));
      })
      .catch((error) => console.error('Error unfollowing user:', error));
  };
  useEffect(()=>{
    if(userInfo?.response){axios.post(`${BACKEND_URL}/api/user/follow/check`,{
      targetUserIdParam : parseInt(userInfo?.response?.id)
    },{
      headers: {
        Authorization: localStorage.getItem("token"),
      }
    }).then(response => {
      console.log(response.data.follow)
      setIsFollowing(response.data.follow)
    }).catch(err => {
        console.log(err)
    })} 
},[userInfo?.response,navigate])


  return (
    <div className="user-profile max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 ">
      {!loading ? (<div className="profile-header text-center border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-800">{userInfo?.response?.name}</h1>
        <p className="text-gray-600">{userInfo?.response?.email}</p>
        <div className="mt-4 flex justify-center space-x-8">
          <span className="text-gray-600">
            <span className="font-semibold text-gray-800">{userInfo?.response?.followers?.length}</span> Followers
          </span>
          <span className="text-gray-600">
            <span className="font-semibold text-gray-800">{userInfo?.response?.following?.length}</span> Following
          </span>
        </div>
        {isFollowing ? (
          <button
            onClick={handleUnfollow}
            className="mt-6 px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition"
          >
            Follow
          </button>
        )}
      </div>) : (<LoadingBlogs />)}

    </div>

  );
};

export default ProfilePage;
