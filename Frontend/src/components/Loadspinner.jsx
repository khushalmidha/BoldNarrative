import React from 'react';

const Loadspinner = () => {
    return (
      <div className="flex justify-center items-center absolute ">
            <div className="flex items-center">
                <svg
                    className="animate-spin h-12 w-12 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <circle
                        className="opacity-30"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z"
                    ></path>
                </svg>
                <span className="ml-4 text-white text-lg font-semibold animate-pulse">
                    Loading...
                </span>
            </div>
        </div>
    );
}

export default Loadspinner;
