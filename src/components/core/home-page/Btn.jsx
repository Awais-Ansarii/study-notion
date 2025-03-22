import React from "react";
import { Link } from "react-router-dom";

const CTABtn = ({ children, active = false, linkTo }) => {
  return (
    <Link
      to={`${linkTo}`}
      className={`${
        active ? "text-black  bg-yellow-50" : "bg-richblue-800"
      } text-center text-[16px] px-6 py-3 rounded-md font-semibold hover:scale-95 transition-all duration-200 hover:shadow-sm hover:shadow-richblack-200 shadow-sm shadow-richblack-200`}
    >
      <div>{children}</div>
    </Link>
  );
};

export default CTABtn;
