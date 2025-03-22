import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightedText from "../components/core/home-page/HighlightedText";
import CTABtn from "../components/core/home-page/Btn";
import Banner from "../assets/Images/banner.mp4";
const Home = () => {
  return (
    <div className="tw-w-full tw-h-full">
      <section>
        <div className="container">
          <div className="relative pt-[68px] flex flex-col items-center mx-auto w-11/12 text-white justify-between gap-y-[38px]">
            {/* button */}
            <Link
              className={`
                mx-auto bg-richblack-800 rounded-full text-richblack-200 transition-all
                 duration-200 hover:scale-95 w-fit group shadow-sm shadow-richblack-200`}
              to="/signup"
            >
              <div className="flex items-center justify-center gap-2 px-6 py-3 ">
                <span>Become an Instructor</span>
                <FaArrowRight />
              </div>
            </Link>

            {/* content  */}
            <div className="flex flex-col items-center text-center gap-4  !max-w-[840px]">
              {/* heading */}
              <h1 className="text-4xl font-semibold ">
                Empower Your Future with
                <HighlightedText text={"Coding Skills"} />
              </h1>
              <p className="text-[16px] font-medium text-richblack-300">
                With our online coding courses, you can learn at your own pace,
                from anywhere in the world, and get access to a wealth of
                resources, including hands-on projects, quizzes, and
                personalized feedback from instructors.
              </p>
            </div>

            {/* buttons */}

            <div className="flex justify-center gap-x-6 items-center mx-auto w-full">
              <CTABtn active={true} linkTo={`/signup`}>
                Learn More
              </CTABtn>
              <CTABtn active={false} linkTo={`/login`}>
                Book a demo
              </CTABtn>
            </div>
            {/* video */}
            <div className="shadow-blue-200  my-10">
              <video muted loop autoPlay className="!mx-auto !w-3/4">
                <source src={Banner} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
