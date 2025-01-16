import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";


function Layout() {
  return (
    <div className="flex flex-col">
      <main>
        <div className="flex flex-1 overflow-y-auto bg-gray-200">
          {/* Sidebar */}
          <Sidebar />
          <div className="flex-1 flex justify-center items-center">
            <div className="w-full max-w-7xl p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
