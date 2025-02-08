import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div>
            <div className='h-screen w-screen bg-custom-teal flex '>
                <div className='absolute top-0 left-0 flex flex-row items-center justify-center'>

                    <img src=" /blog2.png" alt="" className='w-28' />
                    <div className='text-white text-3xl font-bold font-sans -ml-5'>Bold Narratives</div>
                </div>
                <div className='m-16 flex flex-row  justify-evenly w-screen'>
                    <div className='w-1/2 flex justify-center items-center flex-row'>


                      <div >
                      <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Bold Narratives: Where Every Story Commands the Spotlight.</h1>
                        <div class="mb-6 text-lg font-normal text-gray-500 lg:text-xl   dark:text-gray-400">We spotlight transformative ideas, cutting-edge technology, and the innovators behind them, bringing you narratives that inspire and drive change.</div>
                        <Link to="/signup" class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                            Get Started
                            <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </Link>
                      </div>


                    </div>
                    <div>
                        <img src="/blog10.png" alt="" className=' w-full h-full' />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Landing;
