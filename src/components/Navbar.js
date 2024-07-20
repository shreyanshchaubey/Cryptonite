'use client';


import { FaBitcoin } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button'; // Adjust the import path based on your project structure
import { useEffect, useState } from 'react';


const Navbar = ({ setSearchData }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true);
  }, []);

  if (!mounted) {
      return null; // or return a loading state
  }
  const handleNavigate = (path) => {
    router.push(path);
};


  return (
    <nav className="bg-white p-4 flex items-center justify-between w-full">
      <FaBitcoin className="text-yellow-500 text-2xl" onClick={() => { router.push('/'); }} />
      <div className="flex-1 mx-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 rounded bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={(event) => {
            setSearchData(event.target.value);
          }}
        />
      </div>
      <Button onClick={() => { router.push('/search'); }}>Search</Button>
      <div className="flex items-center text-blue-500 ml-4" onClick={() => { router.push('/explore'); }}>
        Explore
      </div>
    </nav>
  );
};

export default Navbar;
