import { createBrowserRouter } from 'react-router'

import Layout from './component/Layout'
import Home from './component/HomePage/Home'
import Login from './component/Auth/Login'
import Register from './component/Auth/Register'
import MainT from './component/Transcription/MainT'
import TeacherLessons from './component/Shere/LessonShere'
// import SharedLessonViewer from './component/Shere/LessonPage'
import LessonsPage from './component/summary/LessonPage'
import FileManager from './component/PersonalAreaPage/FileManager/FileManager'
import HelpSupportPage from './component/Message/HelpSupportPage'

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <Layout></Layout>,
    children: [
      { path: "home", element:<Home></Home> },
            { path: "help", element:<HelpSupportPage></HelpSupportPage> },

      { path: "personal", element: <FileManager></FileManager> },
     
      { index:true, element:<Home/>},
      { path: "transcription", element:<MainT/> },
       { path: "share", element:< TeacherLessons></TeacherLessons>},
      { path: "point", element:< LessonsPage></LessonsPage>}

 

    ]},
    { path: "register", element:<Register></Register> },
    { path: "login", element:<Login></Login> },
  //  {path:"shared-lesson", element:<SharedLessonViewer />}
])
