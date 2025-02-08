import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import DropdownWithSearch from '../components/Dropdown'
import Loadspinner from '../components/Loadspinner'
import axios from 'axios'
import { BACKEND_URL } from '../config'
const CreateBlog = () => {
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')
    const [genre, setGenre] = React.useState('')
    const navigate = useNavigate()
    const[loading,setLoading]=React.useState(false)
    const handleSubmit = async () => {
            setLoading(true)
            try{const response = await axios.post(
              `${BACKEND_URL}/api/blog`,
              {
                title,
                content,
                genre : genre.toLowerCase(),
              },
              {
                headers: {
                  Authorization: localStorage.getItem('token'),
                },
              }
            )
            setLoading(false)
            if(response.status === 403){
                navigate('/signin')
            }
            else if(response.status === 500){
                console.log('Internal server error')
            }
            else{navigate(`/blog/${response.data.blog.id}`)}}
            catch(e){
                setLoading(false)
                console.log(e)
                alert('Error while creating blog')
            }
    }
  return (
    <div>
      <Navbar />
      {loading? <Loadspinner /> : <div className='flex justify-center w-full pt-8'>
        <div className='max-w-screen-lg w-full'>
          <input
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            type='text'
            className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'
            placeholder='Title'
          />

          <TextEditor
            onChange={(e) => {
              setContent(e.target.value)
            }}
          />

          <DropdownWithSearch genre={genre} setGenre={setGenre} post={true} />
          
          <button
            onClick={handleSubmit}
            type='submit'
            className='mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'>
            Publish post
          </button>
        </div>
      </div>}
    </div>
  )
}

function TextEditor({ onChange }) {
    return <div className="mt-2">
        <div className="w-full mb-4 ">
            <div className="flex items-center justify-between border">
            <div className="my-2 bg-white rounded-b-lg w-full">
                <label className="sr-only">Publish post</label>
                <textarea onChange={onChange} id="editor" rows={8} className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2" placeholder="Write an article..." required />
            </div>
        </div>
       </div>
    </div>
    
}
export default CreateBlog
