import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import LoadingBlogs from '../components/LoadingBlogs';

const BlogPage = () => {
    const [blog, setBlog] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const [check, setCheck] = useState(true);
    const [userId, setUserId] = useState(0);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [viewed, setViewed] = useState(false);
    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/user/getid`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        }).then(response => {
            const user = response.data;
            console.log(user);
            if(user){
                setUserId(user.userId);
            }
            else{
                navigate('/signin')
            }
        }).catch(err => {
            alert("Your session has expired. Please log in again.");
            navigate("/signin");
        });
        console.log(userId);
    }, []);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_URL}/api/blog/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            if (response.status === 404) {
                navigate("/home");
            } else {
                const getBlog = response.data.blog;
                setBlog({ ...getBlog, name: getBlog.author.name, votes: getBlog._count.votes, comments: getBlog.comments });
                setLoading(false);
            }
        }).catch(() => {
            navigate("/home");
        });
    }, [check, id, navigate]);

    useEffect(() => {
        async function incrementView() {
            setLoading(true);
            axios.put(`${BACKEND_URL}/api/blog/view`, {
                id: parseInt(id)
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token")
                }
            }).then(response => {
                const getBlog = response.data.blog;
                setBlog({ ...getBlog, name: getBlog.author.name, votes: getBlog._count.votes, comments: getBlog.comments });
            }).catch(err => {
                if (err.status === 403) {
                    setLoading(false);
                    alert("Your session has expired. Please log in again.");
                    navigate("/signin");
                }
            });
            setLoading(false);
            setViewed(true);
        }

        const timer = setTimeout(()=>{
            if(!viewed){
                incrementView();
            }
        }, 60000);
        return () => clearTimeout(timer);
    }, [viewed]);

    const handleComment = () => {
        const commentBody = {
            comment,
            BlogId: parseInt(id)
        };

        axios.post(`${BACKEND_URL}/api/blog/comment`, commentBody, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem("token")
            },
        }).then(() => {
            setComment("");
            setCheck(!check);
        }).catch(e => {
            console.log(e);
        });
    };

    const handleDeleteComment = (commentId) => {
        setLoading(true)
        axios.delete(`${BACKEND_URL}/api/blog/comment/${commentId}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(() => {
            setCheck(!check);
            setSelectedCommentId(null);
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <div>
            <Navbar />
            {!loading && (
                <div>
                    <div className="flex justify-center">
                        <div className="grid grid-cols-12 px-10 w-full max-w-screen-xl pt-12">
                            <div className="col-span-8">
                                <h1 className="text-5xl font-extrabold mb-4">{blog?.title}</h1>
                                <div className="text-slate-500 pb-2">
                                    {`Posted on ${new Date(blog?.createdAt).toLocaleDateString()}`}
                                </div>
                                <div className="text-slate-500 pb-4">
                                    <strong>Genre:</strong> {blog?.genre || 'N/A'}
                                </div>
                                <div className="text-slate-600 pb-4">
                                    <span className="mr-4">
                                        <strong>Views:</strong> {blog?.views || 0}
                                    </span>
                                    <span>
                                        <strong>Votes:</strong> {blog?.votes || 0}
                                    </span>
                                </div>
                                <div className="text-lg leading-relaxed">
                                    {blog?.content}
                                </div>
                            </div>
                            <div className="col-span-4">
                                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                                    <h2 className="text-xl font-bold mb-2">Author</h2>
                                    <div className="flex items-center">
                                        {/* Add author avatar or initials here if available */}
                                        <div>
                                            <h3 className="text-lg font-semibold">{blog?.name || 'Anonymous'}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="flex justify-center mt-10">
                        <div className="w-full max-w-screen-xl">
                            <h2 className="text-2xl font-bold mb-4">Comments ({blog?.comments?.length || 0})</h2>
                            <div className='flex flex-row items-center mb-6'>
                                <input
                                    type="text"
                                    className='w-2/3 border h-10 px-3 rounded-l-lg'
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button onClick={handleComment} className='px-4 bg-custom-teal text-white rounded-r-lg p-2'>
                                    Post
                                </button>
                            </div>
                            {blog?.comments && blog?.comments.length > 0 ? (
                                blog?.comments.map((comment, index) => (
                                    <div key={index} className="relative mb-4 p-4 border rounded-lg bg-white shadow-md">
                                        {comment.authorId === userId && (
                                            <button 
                                                className="absolute top-2 right-2 p-1 focus:outline-none"
                                                onClick={() => setSelectedCommentId(selectedCommentId === comment.id ? null : comment.id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                                                    <path d="M 24 8 C 21.8 8 20 9.8 20 12 C 20 14.2 21.8 16 24 16 C 26.2 16 28 14.2 28 12 C 28 9.8 26.2 8 24 8 z M 24 22 C 21.8 22 20 23.8 20 26 C 20 28.2 21.8 30 24 30 C 26.2 30 28 28.2 28 26 C 28 23.8 26.2 22 24 22 z M 24 36 C 21.8 36 20 37.8 20 40 C 20 42.2 21.8 44 24 44 C 26.2 44 28 42.2 28 40 C 28 37.8 26.2 36 24 36 z"></path>
                                                </svg>
                                            </button>
                                        )}
                                        <div className="text-lg font-semibold">{comment.author.name}</div>
                                        <div className="text-slate-600">{comment.comment}</div>
                                        {selectedCommentId === comment.id && comment.authorId === userId && (
                                            <div className="absolute top-8 right-2 bg-white border rounded shadow-md">
                                                <button 
                                                    className="block w-full text-left px-4 py-2 hover:bg-red-200"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-500">No comments yet. Be the first to comment!</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {loading && <LoadingBlogs />}
        </div>
    );
}

export default BlogPage;
