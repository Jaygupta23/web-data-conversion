import React, { useContext, useEffect, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import logo from "../../assets/images/image.png";
import { FaCircleUser } from "react-icons/fa6";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import dataContext from "../../Store/DataContext";
import { onGetVerifiedUserHandler } from "../../services/common";

const menuItems = [
  {
    name: "Create Template",
    href: "imageuploader",
    permission: "createTemplate",
  },
  {
    name: "Csv Uploader",
    href: "csvuploader",
    permission: "csvuploader",
  },
  {
    name: "CSV Compare",
    href: "comparecsv",
    permission: "comparecsv",
  },
  {
    name: "Data Entry",
    permission: "dataEntry",
    href: "datamatching",
  },

  {
    name: "Result Generator",
    permission: "resultGenerator",
    href: "resultGeneration",
  },
];

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const mainUrl = location.pathname?.slice(1)?.split("/");
  // const userData = JSON.parse(localStorage.getItem("userData"));
  const [userData, setUserData] = useState({});
  const datactx = useContext(dataContext);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await onGetVerifiedUserHandler();
        setUserData(response.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
    console.log(userData);
  }, []);
  useEffect(() => {
    if (userData && Object.keys(userData).length !== 0) {
      // if (userData.role === "Admin") {
      //   const currentPath =
      //     localStorage.getItem("currentPath") === "/"
      //       ? "imageuploader"
      //       : localStorage.getItem("currentPath");
      //   navigate(currentPath);
      // } else {
      const firstAllowedLink = menuItems.find(
        (item) => userData.permissions[item.permission]
      );
      if (firstAllowedLink) {
        const currentPath =
          localStorage.getItem("currentPath") === "/"
            ? firstAllowedLink.href
            : localStorage.getItem("currentPath");
        navigate(currentPath);
      }
    }
    // }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem("currentPath", location.pathname);
  }, [location.pathname]);

  const userMenuItems = [
    {
      name: "Profile",
      onClick: () => {
        navigate("/profile");
        setIsUserMenuOpen(false);
      },
    },
    {
      name: "Create User",
      onClick: () => {
        navigate("/create-user");
        setIsUserMenuOpen(false);
      },
    },
    {
      name: "All Users",
      onClick: () => {
        navigate("/all-user");
        setIsUserMenuOpen(false);
      },
    },
    {
      name: "Logout",
      onClick: () => {
        localStorage.clear();
        setUserData({});
        datactx.modifyIslogin(false);
        navigate("/");
        setIsUserMenuOpen(false);
      },
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = (event) => {
    event.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isUserMenuOpen && event.target.closest(".user-menu") === null) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isUserMenuOpen]);

  const filteredMenuItems =
    userData &&
    menuItems?.filter((item) => {
      if (Object.keys(userData).length !== 0) {
        return userData?.permissions[item?.permission];
      }
    });

  return (
    <>
      <div className={`fixed w-full z-10 bg-white   `}>
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8 ${
            isMenuOpen ? "hidden " : ""
          }`}
        >
          <div className="inline-flex items-center space-x-2">
            <img className="h-14 w-auto" src={logo} alt="Your Company" />
          </div>
          <div className="hidden lg:block">
            <ul className="flex justify-center items-center space-x-2">
              {/* {userData?.role === "Admin"
                ? menuItems?.map((item) => {
                    const active =
                      mainUrl[0] === item.href
                        ? "bg-gray-200 duration-1000 transition-colors ease-in-out text-teal-500"
                        : "";
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={() => {
                            setIsUserMenuOpen(false);
                          }}
                          className={`text-lg px-2 rounded-md py-1 font-semibold text-gray-700 no-underline hover:text-teal-500 ${active}`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })
                : */}
              {filteredMenuItems?.map((item) => {
                const active =
                  mainUrl[0] === item.href
                    ? "bg-gray-300 duration-1000 transition-colors ease-in-out text-teal-500"
                    : "";
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={`text-lg px-2 rounded-md py-1 font-semibold text-gray-700 no-underline  hover:text-teal-500 ${active}`}
                      onClick={() => {
                        setIsUserMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          <div
            onClick={toggleUserMenu}
            className="relative flex gap-4 bg-slate-200 shadow-sm px-6 rounded-lg py-2"
          >
            <div>
              <h4 className="text-xl font-semibold">{userData.userName}</h4>
              <p className="text-center text-sm">{userData.role}</p>
            </div>
            <button type="button" className="rounded-full">
              <FaCircleUser className="w-7 h-7 text- mt-1 text-indigo-700" />
            </button>
            {userData?.role === "Admin"
              ? isUserMenuOpen && (
                  <div className="absolute right-0 mt-16 w-48 bg-white rounded-lg shadow-xl z-20 ">
                    <div className="py-1">
                      {userMenuItems?.map((item) => (
                        <button
                          key={item.name}
                          onClick={item.onClick}
                          className="block px-4 py-1 text-md font-medium text-gray-600 hover:bg-gray-200 hover:text-blue-500 w-full text-left"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              : isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      {userMenuItems
                        .filter(
                          (item) =>
                            item.name === "Logout" || item.name === "Profile"
                        )
                        .map((item) => (
                          <button
                            key={item.name}
                            onClick={item.onClick}
                            className="block px-4 py-2 text-md font-medium text-gray-600 hover:bg-gray-300 w-full text-left"
                          >
                            {item.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
          </div>
          <div className="lg:hidden order-first">
            <TiThMenu
              onClick={toggleMenu}
              className="h-6 w-6 cursor-pointer text-blue-700"
            />
          </div>
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 w-[40vw] h-[100vh]  bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="">
                    <img
                      className="h-10 w-auto"
                      src={logo}
                      alt="Your Company"
                    />
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-full"
                      onClick={toggleUserMenu}
                    >
                      <FaCircleUser className="w-7 h-7 text- mt-1 text-indigo-700" />
                    </button>
                    {userData?.role === "Admin"
                      ? isUserMenuOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 user-menu">
                            <div className="py-1">
                              {userMenuItems?.map((item) => (
                                <button
                                  key={item.name}
                                  onClick={() => {
                                    item.onClick();
                                    setIsMenuOpen(!isMenuOpen);
                                  }}
                                  className="block px-4 py-2 text-md font-medium text-gray-600 hover:bg-gray-300 w-full text-left"
                                >
                                  {item.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      : isUserMenuOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 user-menu">
                            <div className="py-1">
                              {userMenuItems
                                .filter(
                                  (item) =>
                                    item.name === "Logout" ||
                                    item.name === "Profile"
                                )
                                .map((item) => (
                                  <button
                                    key={item.name}
                                    onClick={() => {
                                      item.onClick();
                                      setIsMenuOpen(!isMenuOpen);
                                    }}
                                    className="block px-4 py-2 text-md font-medium text-gray-600 hover:bg-gray-300 w-full text-left"
                                  >
                                    {item.name}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                  </div>
                  <div className="order-first">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center rounded-md  text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <span className="sr-only">Close menu</span>
                      <RxCross2
                        className="h-8 w-8 text-gray-700"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
                <div className="mt-10 flex ">
                  <nav className="grid gap-y-4">
                    <ul className="mx-2">
                      {userData?.role === "Admin"
                        ? menuItems?.map((item) => {
                            const active =
                              mainUrl[0] === item.href
                                ? "bg-gray-200 text-teal-500 duration-1000 transition-colors ease-in-out"
                                : "";
                            return (
                              <li key={item.name} className="my-3">
                                <Link
                                  to={item.href}
                                  onClick={() => {
                                    setIsUserMenuOpen(false);
                                    setIsMenuOpen(!isMenuOpen);
                                  }}
                                  className={`text-lg px-2 rounded-md py-1 font-semibold text-gray-700 no-underline hover:text-teal-500  ${active}`}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            );
                          })
                        : filteredMenuItems?.map((item) => {
                            const active =
                              mainUrl[0] === item.href
                                ? "bg-gray-200 text-teal-500 duration-1000 transition-colors ease-in-out"
                                : "";
                            return (
                              <li key={item.name} className="my-3">
                                <NavLink
                                  to={item.href}
                                  className={`text-lg px-2 rounded-md py-1 font-semibold text-gray-700 no-underline hover:text-teal-500 ${active}`}
                                  onClick={() => {
                                    setIsUserMenuOpen(false);
                                    setIsMenuOpen(!isMenuOpen);
                                  }}
                                >
                                  {item.name}
                                </NavLink>
                              </li>
                            );
                          })}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
