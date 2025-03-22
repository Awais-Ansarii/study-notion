import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
const Home = () => {
  return (
    <div>
      <section>
        <div>

          <div>
            {/* button */}
            <Link className={``} to="/signup">
              <span>Become an Instructor</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
