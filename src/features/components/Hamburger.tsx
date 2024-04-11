import { useEffect, useState } from "react";

import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import "./menu.css";

type HamburgerProps = {
  children?: React.ReactNode;
};

// TODO: escape key to close menu

const Hamburger: React.FC<HamburgerProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Box
      sx={{
        display: "block",
        lg: {
          display: "none",
        },
      }}
    >
      <div className={isOpen ? "menu-toggle" : ""} />
      <button
        aria-controls="global-menu"
        aria-expanded={isOpen}
        aria-haspopup={true}
        aria-label="メニュー項目を開く"
        className="menu-icon"
        onClick={() => setIsOpen((v) => !v)}
        type="button"
      >
        <div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div>メニュー</div>
      </button>
      <nav className="menu" id="global-menu">
        {children}
      </nav>
    </Box>
  );
};

export default Hamburger;
