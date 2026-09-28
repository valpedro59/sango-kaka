import { useEffect, useRef, useState } from "react";
import { LogOut, User } from "lucide-react";

const CustomDropdown = ({ user, onProfile, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const initials = user?.prenom?.[0] || "";

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="btn-secondary"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="bg-neutral-900 text-white rounded-full px-1.5 py-0.5">
          {initials}
        </span>
        <span>
          {user?.prenom} {user?.nom}
        </span>
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="menu">
          <ul className="flex flex-col justify-center gap-1 mx-auto px-2 py-3">
            <li
              role="menuitem"
              tabIndex={0}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-100 cursor-pointer transition-colors"
              onClick={onProfile}
              onKeyDown={(e) => e.key === "Enter" && onProfile?.()}
            >
              <User size={16} className="text-neutral-500" /> Profil
            </li>
            <li
              role="menuitem"
              tabIndex={0}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-100 cursor-pointer transition-colors"
              onClick={onLogout}
              onKeyDown={(e) => e.key === "Enter" && onLogout?.()}
            >
              <LogOut size={16} className="text-neutral-500" /> Déconnexion
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
export default CustomDropdown;
