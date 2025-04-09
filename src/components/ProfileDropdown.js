import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";

const ProfileDropdown = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={ref}>
      <button onClick={toggleDropdown} className="btn btn-light d-flex align-items-center">
        <FaUserCircle size={24} className="me-2" />
        Profil
      </button>
      {open && (
        <div
          className="position-absolute bg-white border shadow rounded mt-2"
          style={{
            right: 0,
            zIndex: 1000,
            minWidth: "150px",
          }}
        >
          <button className="dropdown-item w-100 text-start" onClick={onLogout}>
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
