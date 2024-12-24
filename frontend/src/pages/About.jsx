import React from "react";

export default function About() {
  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div class="max-w-screen-md mb-8 lg:mb-16">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Automated Answer Sheet Assessment System
          </h2>
          <p class="text-gray-500 sm:text-xl dark:text-gray-400">
            We focus on leveraging cutting-edge OCR technology and LLM-powered
            algorithms to simplify grading, improve accuracy, and enhance
            student outcomes.
          </p>
        </div>
        <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          <div>
            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
              <img
                src="/pen-new-square-svgrepo-com.svg"
                alt="icon"
                className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
              />
            </div>
            <h3 class="mb-2 text-xl font-bold dark:text-white">
              Handwritten Text Recognition (HTR)
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Digitize handwritten content seamlessly. Our system converts
              handwritten text into editable, computer-readable formats with
              high accuracy, saving you time and effort.
            </p>
          </div>
          <div>
            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
              <svg
                class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
              </svg>
            </div>
            <h3 class="mb-2 text-xl font-bold dark:text-white">
              Grading Automation
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Leverage advanced LLMs to analyze and parse student submissions,
              ensuring a comprehensive and intelligent evaluation process.
            </p>
          </div>
          <div>
            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
              <img
                src="/robot-svgrepo-com.svg"
                alt="icon"
                className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
              />
            </div>
            <h3 class="mb-2 text-xl font-bold dark:text-white">
              AI-Powered Parsing for Grading
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Leverage advanced LLMs to analyze and parse student submissions,
              ensuring a comprehensive and intelligent evaluation process.
            </p>
          </div>
          <div>
            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
            <img
                src="/error-svgrepo-com.svg"
                alt="icon"
                className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
              />
            </div>
            <h3 class="mb-2 text-xl font-bold dark:text-white">
              Error Detection & Feedback
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Identify syntax errors, inconsistencies, or gaps in student
              submissions. Provide constructive feedback to help learners
              improve and meet academic standards.
            </p>
          </div>
          <div>
            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
            <img
                src="/report-svgrepo-com.svg"
                alt="icon"
                className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
              />
            </div>
            <h3 class="mb-2 text-xl font-bold dark:text-white">
              Report Generation
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Generate detailed reports with breakdowns of scores, errors, and
              feedback for individual or bulk submissions. Simplify
              communication with students and stakeholders.
            </p>
          </div>
          <div>
            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
              <svg
                class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 class="mb-2 text-xl font-bold dark:text-white">
              Efficiency and Accuracy
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Reduce manual effort and errors with automated recognition and
              grading. Our system is designed for educators who value precision
              and reliability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
