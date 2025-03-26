import { createBrowserRouter } from 'react-router'

import Layout from './component/Layout'
import Home from './component/HomePage/Home'
import FileManager from './component/PersonalAreaPage/FileManager'
import Login from './Auth/Login'
import Register from './Auth/Register'
import MainT from './component/Transcription/MainT'

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <Layout></Layout>,
    children: [
      { path: "home", element:<Home></Home> },
      { path: "personal", element: <FileManager></FileManager> },
     
      { index:true, element:<Home/>},
      { path: "transcription", element:<MainT/> }


    ]},
    { path: "register", element:<Register></Register> },
    { path: "login", element:<Login></Login> }
  
])
