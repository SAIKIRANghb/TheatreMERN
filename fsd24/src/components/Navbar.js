// import React, { useState, useContext, useEffect } from 'react';
// import '../styles/Navbar.css'; // Import the CSS file for Navbar
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext'; // Import AuthContext

// const Navbar = () => {
//   const [menuActive, setMenuActive] = useState(false);
//   const [moviesDropdown, setMoviesDropdown] = useState(false);
//   const [profileDropdown, setProfileDropdown] = useState(false);
  
//   const { isLoggedIn} = useContext(AuthContext); // Get state and logout from context

//   // Effect to control profile visibility based on login state
//   useEffect(() => {
//     const profilePic = document.getElementById("profilePic");
//     const userButton = document.getElementById("userButton");

//     if (isLoggedIn) {
//       profilePic.style.display = "inline";
//       userButton.style.padding = "3px";
//       userButton.style.borderRadius = "50%";
//       userButton.textContent = "";
//     } else {
//       profilePic.style.display = "none";
//       userButton.textContent = "Profile";
//     }
//   }, [isLoggedIn]);

//   const toggleMenu = () => {
//     setMenuActive(!menuActive);
//     // Close dropdowns when toggling menu
//     setMoviesDropdown(false);
//     setProfileDropdown(false);
//   };

//   return (
//     <div className="navbar-container">
//       <div className="navbar">
//         {/* Hamburger Menu */}
//         <div className={`hamburger ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
//           <div></div>
//           <div></div>
//           <div></div>
//         </div>

//         {/* Logo */}
//         <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <img src="https://static.vecteezy.com/system/resources/thumbnails/012/657/549/small/illustration-negative-film-reel-roll-tapes-for-movie-cinema-video-logo-vector.jpg" alt="Logo" />
//           <p>XYZ MOVIES</p>
//         </div>

//         {/* Navigation Menu */}
//         <div className={`menu ${menuActive ? 'active' : ''}`}>
//           <Link to='/' className="master">Home</Link>

//           {/* Movies Dropdown */}
//           <div className="dropdown">
//             <div className="master" >Movies</div>
//             <div className={`dropdown-content ${moviesDropdown ? 'show' : ''}`}>
//               <Link to="/">Now Playing</Link>
//               <Link to="/">Coming Soon</Link>
//               <Link to="/">Top Rated</Link>
//             </div>
//           </div>

//           <div className="dropdown">
//             <div className="master" >Theatre</div>
//             <div className={`dropdown-content ${moviesDropdown ? 'show' : ''}`}>
//               <Link to="/svc">SVC</Link>
//               <Link to="/inox">INOX</Link>
//               <Link to="/v-mega">V-Mega</Link>
//               <Link to="/pvr">PVR</Link>
//             </div>
//           </div>

//           {/* Profile Dropdown */}
//           <div className="dropdown">
//             <div className="master" >Login/Profile</div>
//             <div className={`dropdown-content ${profileDropdown ? 'show' : ''}`}>
//               {isLoggedIn ? (
//                 <>
//                   <Link to="/">Profile</Link>
//                   <Link to="/">Settings</Link>
//                   <Link to="/logout">Logout</Link> {/* Logout link */}
//                 </>
//               ) : (
//                 <>
//                   <Link to="/login">Login</Link>
//                   <Link to="/register">Register</Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="search-bar">
//           <input type="text" placeholder="Search..." />
//         </div>

//         {/* Profile Section */}
//         <div className="profile">
//           <img id="profilePic" src="https://images.hindustantimes.com/img/2024/07/17/1600x900/kalki_1721207150115_1721207150501.jpg" alt="Profile" />
//           <Link id="userButton" to="/">Profile</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React, { useState, useContext, useEffect } from 'react';
import '../styles/Navbar.css'; // Import the CSS file for Navbar
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [moviesDropdown, setMoviesDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [theatres, setTheatres] = useState([]); // State to hold the list of theatres

  const  isLoggedIn  = useContext(false); // Get state from context //AuthContext

  // Fetch all theatres from the backend
  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await fetch('http://localhost:5000/theatres'); // Replace with your actual API endpoint
        const data = await response.json();
        console.log(data)
        setTheatres(data);
      } catch (error) {
        console.error('Error fetching theatres:', error);
      }
    };

    fetchTheatres();
  }, []);

  // Effect to control profile visibility based on login state
  useEffect(() => {
    const profilePic = document.getElementById("profilePic");
    const userButton = document.getElementById("userButton");

    if (isLoggedIn) {
      profilePic.style.display = "inline";
      userButton.style.padding = "3px";
      userButton.style.borderRadius = "50%";
      userButton.textContent = "";
    } else {
      profilePic.style.display = "none";
      userButton.textContent = "Profile";
    }
  }, [isLoggedIn]);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
    // Close dropdowns when toggling menu
    setMoviesDropdown(false);
    setProfileDropdown(false);
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        {/* Hamburger Menu */}
        <div className={`hamburger ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Logo */}
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://static.vecteezy.com/system/resources/thumbnails/012/657/549/small/illustration-negative-film-reel-roll-tapes-for-movie-cinema-video-logo-vector.jpg" alt="Logo" />
          <p>XYZ MOVIES</p>
        </div>

        {/* Navigation Menu */}
        <div className={`menu ${menuActive ? 'active' : ''}`}>
          <Link to='/' className="master">Home</Link>

          {/* Movies Dropdown */}
          <div className="dropdown">
            <div className="master" >Movies</div>
            <div className={`dropdown-content ${moviesDropdown ? 'show' : ''}`}>
              <Link to="/">Now Playing</Link>
              <Link to="/">Coming Soon</Link>
              <Link to="/">Top Rated</Link>
            </div>
          </div>

          {/* Dynamic Theatre Dropdown */}
          <div className="dropdown">
            <div className="master">Theatres</div>
            {/* {console.log(theatres)} */}
            <div className={`dropdown-content ${moviesDropdown ? 'show' : ''}`}>
              {theatres && theatres.map((theatre) => (
                <Link key={theatre._id} to={`/${theatre.theatrename}`}>
                  {theatre.theatrename.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <div className="master">Login/Profile</div>
            <div className={`dropdown-content ${profileDropdown ? 'show' : ''}`}>
              {isLoggedIn ? (
                <>
                  <Link to="/">Profile</Link>
                  <Link to="/">Settings</Link>
                  <Link to="/logout">Logout</Link> {/* Logout link */}
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>

        {/* Profile Section */}
        <div className="profile">
          <img id="profilePic" src="https://images.hindustantimes.com/img/2024/07/17/1600x900/kalki_1721207150115_1721207150501.jpg" alt="Profile" />
          <Link id="userButton" to="/">Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
