import React from 'react';
import { Link } from 'react-router-dom';
import NavbarsignUp from '../Components/NavbarsignUp';
import img1 from "../assets/home1.jpg";
import img2 from "../assets/home2.jpg";

export default function Home() {
  return (
    <>
      <div>
        <NavbarsignUp button="Get Started" />
      </div>

      <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-gray-100">
        <img src={img1} alt="Notes" className="w-64 h-auto rounded-lg shadow-lg mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">STILL WRITING NOTES??</h1>
        <h3 className="text-xl text-gray-600">CRYING IF LOST!?</h3>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-white">
        <img src={img2} alt="Support" className="w-64 h-auto rounded-lg shadow-lg mb-4" />
        <h3 className="text-2xl text-green-700 font-semibold">DON'T WORRY WE ARE HERE</h3>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-blue-50">
        <h1 className="text-3xl font-bold text-blue-800 mb-3">WRITE YOUR NOTES IN OUR NOTION FILE!</h1>
        <p className="text-lg text-gray-700 max-w-xl">
          WORRYING ABOUT HOW TO READ AGAIN? SIMPLE — COMEBACK, SIGN IN, AND YOU ARE JUST ONE CLICK AWAY!
        </p>
      </div>
    </>
  );
}
