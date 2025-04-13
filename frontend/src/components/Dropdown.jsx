import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ setDropdownValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Llama-3.2-11B');
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setDropdownValue(option);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-end w-full pr-4">
      <div className="relative w-64" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="w-full bg-gray-100 hover:bg-gray-200 text-left px-4 py-2 rounded-xl border border-gray-300 flex items-center justify-between transition duration-200 shadow-sm"
        >
          {selectedOption}
          <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              <li>
                <button
                  onClick={() => handleSelect('GPT4- Pro')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  GPT4- Pro OCR
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelect('OpenAI GPT-4o')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  OpenAI GPT-4o OCR
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelect('Llama-3.2-11B')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                >
                  Llama-3.2-11B OCR
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelect('H2OVL-mississippi')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                > 
                H2OVL-mississippi OCR
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
