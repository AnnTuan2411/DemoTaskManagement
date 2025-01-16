import { useState } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom"; // Import useLocation

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility
  const location = useLocation(); // Get current location

  const menuItems = [
    {
      id: "update-employees",
      label: "Quản lý nhân viên",
      icon: <svg className="w-5 h-5 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22 "    style={{ width: '20px' }}>
        <path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>,
      path: "/employee-managment",
    },
    {
      id: "update-etask",
      label: "Quản lý E task",
      icon: <svg className="w-5 h-5 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: '20px' }}>
        <path fillRule="evenodd" d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" clipRule="evenodd" />
      </svg>,
      path: "/etask-managment",
    },
  ];

  return (
    <div
      className={`${sidebarOpen ? "w-64" : "w-20"
        } text-white transition-all flex flex-col items-start p-4 min-h-screen`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between w-full mb-4">
        {sidebarOpen && (
          <div className="flex justify-center items-center w-full">
            {/* Header content (if any) */}
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-2xl"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar menu */}
      <div className={`space-y-4 text-base w-full overflow-auto`}>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`flex items-center font-semibold hover:text-orange-400 hover:bg-sky-700 cursor-pointer px-2 py-4 ${location.pathname === item.path
                  ? "border-l-2 border-orange-500 "
                  : ""
                }`} // Highlight based on pathname
            >
              {item.icon}
              {/* Toggle the label based on sidebar open state */}
              {sidebarOpen && (
                <Link to={item.path} className="ml-2">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
