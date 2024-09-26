import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div id="admin-sidebar" className="admin-sidebar">
      <div id="admin-sidebar-header" className="admin-sidebar-header">
        Admin Dashboard
      </div>
      <ul id="admin-sidebar-list" className="admin-sidebar-list">
        <li className="admin-sidebar-item">
          <Link to="/admin/movies">Movies</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to="/admin/theatres">Theatres</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to="/admin/screens">Screens</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to="/admin/slots">Slots</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to="/admin/users">Users</Link>
        </li>
        <li className="admin-sidebar-item">
          <Link to="/admin/webpage">WebPage</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
