import React from "react";
import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-300 py-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Container */}
        <div className="grid grid-cols-1  lg:grid-cols-2   gap-2">
          {/* Logo and Description */}
          <div>
            <h2 className="text-xl font-bold text-black">SHEET EVALUATOR</h2>
            <p className="text-gray-600 mt-2">
              Effortlessly assess handwritten copies with SHEET EVALUATOR –
              delivering accurate results and detailed evaluations in just a few
              clicks.
            </p>
          </div>

          {/* Information */}
          <div className=" sm:text-right  ">
            <ul className="mt-4 space-y-2">
              
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  About 
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  Terms of Use
                </a>
              </li>
              </ul>
          </div>


          {/* Social Media Links */}
          <div className="lg:col-span-3 mt-3">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=100035782686564"
                  className="text-gray-600 hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="text-2xl" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/khubaib11"
                  className="text-gray-600 hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="text-2xl" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/khubaib-munawar-khan/"
                  className="text-gray-600 hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 border-t border-gray-200 pt-4 text-center text-sm text-gray-600">
          Copyright &copy; 2024 by SukkurIBA | All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
