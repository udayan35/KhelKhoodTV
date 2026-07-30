import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Layout from './Layout.jsx'
import Home from './components/Home/Home.jsx'

import Videos from './components/Video/Videos.jsx'
import Contact from './components/Contact/Contact.jsx'
import Archives from './components/Archives/Archives.jsx'
import LiveScores from './components/LiveScores/LiveScores.jsx'
import CreateArticle from './components/Home/CreateArticle.jsx'
import Article from './components/Home/Article.jsx'
import UploadVideo from './components/Video/UploadVideo.jsx'
import PlayVDO from './components/Video/PlayVDO.jsx'
import Login from './components/Auth/Login.jsx'
import Register from './components/Auth/Register.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'create-article',
        element: <CreateArticle />
      },
      {
        path: 'article/:slug',
        element: <Article />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'upload-video',
        element: <UploadVideo />
      },
      {
        path: 'videos',
        element: <Videos />
      },
      {
        path: 'videos/:slug',
        element: <PlayVDO />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'archives',
        element: <Archives />
      },
      {
        path: 'live-scores',
        element: <LiveScores />
      }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)
