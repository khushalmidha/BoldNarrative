import { Link } from "react-router-dom"
export default function Navbar() {
    return (
        <div className=' w-screen h-28 bg-custom-teal'>
            <Link to={'/home'}>
                <div className='absolute top-2 left-0 flex flex-row items-center justify-center'>

                    <img src=" /blog2.png" alt="" className='w-28' />
                    <div className='text-white text-3xl font-bold font-sans -ml-5'>Bold Narratives</div>
                </div></Link>
        </div>)
}