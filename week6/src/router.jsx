import { createHashRouter } from "react-router-dom";

import Home from "./pages/front/Home";
import Products from "./pages/front/Products";
import Cart from "./pages/front/Cart";
import ProductPage from "./pages/front/ProductPage";

import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import FrontLayout from "./layout/FrontLayout";
import AdminLayout from "./layout/AdminLayout";

export const router = createHashRouter([
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <ProductPage />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

