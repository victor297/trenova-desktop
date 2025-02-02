import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between mt-auto px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
      <h5 className="text-sm mb-4 text-center font-medium text-gray-600 sm:!mb-0 md:text-lg">
        <p className="text-sm md:text-base mb-4 text-center text-gray-600 sm:!mb-0">
          ©{1900 + new Date().getYear()} LearnNova. All Rights Reserved.
        </p>
      </h5>
      <div>
        <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://wa.me/+2348179361381"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Support
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
