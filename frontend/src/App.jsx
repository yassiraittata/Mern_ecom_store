import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <p>Home Page</p>,
  },
  {
    path: "/about",
    element: <p>About Page</p>,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
