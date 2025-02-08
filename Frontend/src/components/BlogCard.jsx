import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config";

const colors = [
  { bg: 'bg-red-500', border: 'border-red-500' },
  { bg: 'bg-blue-500', border: 'border-blue-500' },
  { bg: 'bg-green-500', border: 'border-green-500' },
  { bg: 'bg-yellow-500', border: 'border-yellow-500' },
  { bg: 'bg-purple-500', border: 'border-purple-500' },
  { bg: 'bg-orange-500', border: 'border-orange-500' },
];

const GenreIndicator = ({ genre }) => {
  // Function to get a random color class from the colors array
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const { bg, border } = getRandomColor();

  return (
    <span className={`text-slate-500 text-sm border rounded-2xl p-1 w-28 flex-frow items-center flex justify-evenly ${border}`}>
      <div className={`w-3 h-3 rounded-full ${bg}`}></div>
      {genre}
    </span>
  );
};
export const BlogCard = ({
  id,
  authorName,
  title,
  genre,
  publishedDate,
  views,
  votes:initialVotes,
  authorId
}) => {


  const [votes, setVotes] = useState(initialVotes)
  const [isUpvoted, setIsUpvoted] = useState(false);
  useEffect(()=>{
    axios.post(`${BACKEND_URL}/api/blog/vote/check`, { id }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem("token")
      }
    })
    .then(response => {
      const upvoted = response.data.vote;
      setIsUpvoted(upvoted);
      setColor(upvoted ? 'red' :'currentColor');
    })
    .catch(error => {
      console.error("Error upvoting:", error);
    });
  },[])

  useEffect(() => {
    

  }, [votes, isUpvoted,id]); 

  const [color, setColor] = useState('currentColor');
  const handleClick = () => {

    axios.post(`${BACKEND_URL}/api/blog/vote`, { id }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem("token")
      }
    })
    .then(response => {
      const upvoted = response.data.vote;
      setIsUpvoted(upvoted);
      setVotes(prevVotes => upvoted ? prevVotes + 1 : prevVotes - 1);
      setColor(upvoted ? 'red' :'currentColor');
    })
    .catch(error => {
      console.error("Error upvoting:", error);
    });

  };

  const time = (publishedDate) => {
    const now = new Date();
    const published = new Date(publishedDate);
    const timeDifference = now - published;
    

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0 &&days<2) return `${days} day ago`;
    else if(days>=2) return `${days} days ago`
    if (hours > 0 && hours < 2) return `${hours} hour ago`;
    else if (hours >= 2) return `${hours} hours ago`
    if (minutes >= 2) return `${minutes} minute(s) ago`;
    else if (minutes > 0 && minutes < 2) return `${minutes} minute ago`
    return `${seconds} second(s) ago`;
  }
  return (

    <div className="p-6 mt-6 border border-slate-300 rounded-lg shadow-lg w-1/2 mx-auto  bg-white transition-transform transform hover:scale-105">


      <div className="mt-4">
        <Link to={`/blog/${id}`}><h2 className="text-2xl font-bold">{title}</h2></Link>
        <p className="text-md text-gray-700 mt-2">Content</p>
      </div>
      <div className="flex flex-col space-x-4 w-full">
        <div className="flex flex-col justify-end items-end w-full">
          <Link to={`/profile/${authorId}`}><span className="font-semibold text-lg ">Author: {authorName}</span></Link>
          <GenreIndicator genre={genre} />
          <span className="text-slate-500 font-bold text-sm">Uploaded {time(publishedDate)}</span>


        </div>

      </div>
      <div className={`flex flex-row items-center justify-start `}>
        <svg  onClick={handleClick} className=" cursor-pointer" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg"><path fill={color} d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" /></svg>
        <div className="px-1 font-bold">{votes}</div>
        <div className="px-4 flex flex-row-reverse items-center"><div className="font-bold px-2">{views}</div><svg enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><polyline fill="none" points="   649,137.999 675,137.999 675,155.999 661,155.999  " stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" /><polyline fill="none" points="   653,155.999 649,155.999 649,141.999  " stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" /><polyline fill="none" points="   661,156 653,162 653,156  " stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" /></g><g><g><path d="M16,25c-4.265,0-8.301-1.807-11.367-5.088c-0.377-0.403-0.355-1.036,0.048-1.413c0.404-0.377,1.036-0.355,1.414,0.048    C8.778,21.419,12.295,23,16,23c4.763,0,9.149-2.605,11.84-7c-2.69-4.395-7.077-7-11.84-7c-4.938,0-9.472,2.801-12.13,7.493    c-0.272,0.481-0.884,0.651-1.363,0.377c-0.481-0.272-0.649-0.882-0.377-1.363C5.147,10.18,10.333,7,16,7    c5.668,0,10.853,3.18,13.87,8.507c0.173,0.306,0.173,0.68,0,0.985C26.853,21.819,21.668,25,16,25z" /></g><g><path d="M16,21c-2.757,0-5-2.243-5-5s2.243-5,5-5s5,2.243,5,5S18.757,21,16,21z M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3    s3-1.346,3-3S17.654,13,16,13z" /></g></g></svg></div>
      </div>


    </div>

  );
}