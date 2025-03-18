import React from "react";
import { Link } from "react-router-dom";
import { FaUserLargeSlash } from "react-icons/fa6";


const NotAllowed = () => {
  return (
    <section
  className="notmain"
    >
      <span className="heading">
      <FaUserLargeSlash />
      </span>
      <span>
        Access Denied, Please try again Later
      </span>
      <Link to={"/"}>
        <button>
          Back to Login
        </button>
      </Link>
    </section>
  );
};

export default NotAllowed;
