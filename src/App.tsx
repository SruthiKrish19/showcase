import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from './components/RootLayout'
import Home from './pages/Home'
import WorkDetail from './pages/WorkDetail'
import PitchDetail from './pages/PitchDetail'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/work/:slug', element: <WorkDetail /> },
      { path: '/pitch/:slug', element: <PitchDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
