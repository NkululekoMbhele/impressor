import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex w-full justify-between px-12 md:px-40 h-16 items-center">
        <div className="logo flex h-full items-center">
              <img className="mr-4 w-8" src="https://firebasestorage.googleapis.com/v0/b/nkululekodotio-projects/o/impressor%2Fwebsite%2Ffavicon-8.png?alt=media&token=c30700e6-0793-410e-b598-2cb1ed3fa6d5" alt="logo" />
            <h1 className="text-white uppercase font-semibold text-xl"><span className="text-yellow-300">IM</span>PRESSOR</h1>
        </div>
        <a href="https://nkululeko.io" className="text-white">HOME</a>
    </nav>
  );
}

export default Navbar;
