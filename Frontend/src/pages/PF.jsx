import React, { useEffect, useRef, useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import LoadingBlogs from '../components/LoadingBlogs';
import DropdownWithSearch from '../components/Dropdown';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserProfile from'../components/UserProfile'
import ProfilePage from './ProfilePage';
const PF = () => {
    const {id}=useParams();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [userId,setUserId]=useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const skipPages = (page - 1) * 10;
    const [genre, setGenre] = useState("All");
    const [searchQuery, setsearchQuery] = useState("")
    const [userInfo,setUserInfo] = useState([])
    const ref = useRef();
    const genreF = {
        genre: genre.toLowerCase(),
        authorId:id,
        search: searchQuery,
        skip: skipPages
    }
    useEffect(() => {

        axios.get(`${BACKEND_URL}/api/user/getid`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          }
        }).then(response => {
          setUserId(response.data.userId);
        }).catch(err => {
          alert("Your session has expired. Please log in again.");
          navigate("/signin");
        });
      }, []);
    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/user/profile?id=${id}`,{
            headers: {
                Authorization: `${localStorage.getItem("token")}`,
            }
        }).then(response => {
            setUserInfo(response.data)
        })
       
    },[])
    useEffect(() => {
        setLoading(true);
        
        axios.post(`${BACKEND_URL}/api/blog/sort/views`, genreF, {

            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlogs(response.data)
                setLoading(false);
            })
            .catch(err => {
                if (err.response && err.response.status === 403) {
                    // Handle 403 Forbidden by setting an error state
                    setError('Unauthorized access. You do not have permission to view this page.');
                    // navigate('/signin');
                } else {
                    // Handle other errors
                    setError('An unexpected error occurred.');
                    // navigate('/signin');
                    localStorage.setItem("token")

                }
                setLoading(false);
            });
    }, [totalPages, page, genre, searchQuery])
    useEffect(() => {
        setLoading(true);
        axios.post(`${BACKEND_URL}/api/blog/total`, genreF, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                const totalPages = Math.ceil(response.data.total / 10);
                setTotalPages(Math.max(totalPages, 1))
                setLoading(false);
            })
            .catch(err => {
                if (err.response && err.response.status === 403) {
                    // Handle 403 Forbidden by setting an error state
                    setError('Unauthorized access. You do not have permission to view this page.');
                    // navigate('/signin');
                } else {
                    // Handle other errors
                    setError('An unexpected error occurred.');
                    // navigate('/signin');

                }
                setLoading(false);
            });
    }, [genre, searchQuery])

    const  viewProfile=()=>{
        
    }
    return (

        <div>
            <div className=' w-screen h-28 bg-custom-teal flex flex-row justify-evenly'>
                <div className=' flex flex-row items-center justify-start w-2/5'>
                <Link to={'/home'}>
                <div className='flex items-center justify-start'>
                <img src=" /blog2.png" alt="" className='w-28' />
                <div className='text-white text-3xl font-bold font-sans -ml-5'>Bold Narratives</div>
                </div>
                    
                </Link>
                </div>
                <div className='w-2/5 h-28 flex items-center justify-start  -ml-56'>
                    <DropdownWithSearch genre={genre} setGenre={setGenre} />
                    <input type="text" className=' p-2 w-4/5 ' placeholder='Search...' onChange={(e) => {

                        const TimeOut = setTimeout(() => {
                            const text = e.target.value;
                            if (text) {
                                if (text.trim()) {

                                    setsearchQuery(text.trim())
                                }
                                else {
                                    setsearchQuery("")
                                }
                            }
                            else {
                                setsearchQuery("")
                            }
                        }, 1000)

                    }} />
                </div>
                
                <div className='w-1/5 flex justify-center items-center'>
                   <UserProfile userId={userId}/>
                </div>
                


            </div>
            <div ref={ref}>
                <div>
                <ProfilePage userInfo1={userInfo}/>
                </div>
                {loading && <div className='w-screen flex justify-between flex-col items-center'><LoadingBlogs /><LoadingBlogs /><LoadingBlogs /><LoadingBlogs /></div>}
                {!loading && blogs.length != 0 && <div> {blogs.map(blog => <BlogCard
                    key={blog.id}
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    publishedDate={blog.createdAt}
                    genre={blog.genre}
                    views={blog.views}
                    votes={blog.votes}
                    authorId = {blog.authorId}
                />)}</div>}
                {
                    !loading && blogs.length == 0 && <div className='flex justify-center items-center w-screen h-96'>No Blog Found</div>
                }
            </div>
            {!loading && <div>
                <div className='flex justify-center items-center w-screen'>
                    <div className="flex justify-between my-10 w-1/2 items-center">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className=" py-2 bg-custom-teal text-white rounded-md w-24 font-bold hover:cursor-pointer"
                        >
                            Previous
                        </button>
                        <span className="font-bold">Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className=" py-2 bg-custom-teal text-white font-bold rounded-md w-24 hover:cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>}

            
        </div>
    );
}

export default PF;
