import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * This component automatically scrolls the page to the top
 * on any route change.
 */
const ScrollToTop = () => {
  // Extracts pathname property from useLocation hook
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component does not render anything to the DOM
  return null;
};

export default ScrollToTop;
