import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import CreatePaste from './src/pages/CreatePaste';
import ViewPaste from './src/pages/ViewPaste';
import "./style.css";


export const App = () => {
  return null;
};


const Router = createBrowserRouter([
  {
    path: "/",
    element: <CreatePaste />
  },
  {
    path: "/api/paste/:id",
    element: <ViewPaste />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={Router} />
);
