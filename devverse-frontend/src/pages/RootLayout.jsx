import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "dark:!bg-[#333] dark:!text-white",
          style: {
            borderRadius: "10px",
          },
        }}
      />
      <Navbar />
      <main className="flex-1 pt-18 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
