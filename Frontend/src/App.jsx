import { createContext, useEffect, useState } from 'react'
import './App.css'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Landing from './pages/Landing'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import CreateBlog from './pages/CreateBlog'
import PF from './pages/PF'
function App() {
    
    return (
      <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<HomePage />} />        
        <Route path="/blog/:id" element={<BlogPage/>}/>
        <Route path="/blog/create" element={<CreateBlog/>}/>        
        <Route path='/profile/:id' element={<PF/>}/>
      </Routes>
      
    </BrowserRouter>
    )
}

export default App
