import RootLayout from "./layouts/root-layout";
import Loader from "./app/common/loader";
import ScrollToTop from "./globals/scroll-to-top";
import { AuthProvider } from "./contexts/AuthContext";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./global-styles.css";
import "./notification-animations.css";

function App() {

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  }, []);

  setTimeout(() => {
    setLoading(false);
  }, 500);

  return (
    <AuthProvider>
      {isLoading && <Loader />}
      <ScrollToTop />
      <RootLayout />
    </AuthProvider>
  )
}

export default App;