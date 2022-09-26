import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function ScrollToTop({ children }: any) {
  const location = useLocation();

  useEffect(() => {
    const container = document.querySelector(".main_wide");
    container && container.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
}

export default ScrollToTop;
