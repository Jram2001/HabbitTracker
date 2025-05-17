import './App.css'
import { useEffect, useState } from 'react';
import QuotesComponent from './components/quotes/quotes.component';
import AuthenticationComponent from './components/Authentication/authentication.component';
import { Route, Routes, useLocation } from 'react-router-dom';
import SignupComponent from './components/Authentication/signup/signup.component';
import Home from './components/Home/home.component';
const App = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const scaleBody = () => {
    const element = document.querySelector('.app-container');
    if (element) {
      console.log(window.screen.width, window.screen.height);
      document.body.style.transform = `scale(${window.screen.width / 1440})`;
      document.body.style.height = window.screen.height * (window.screen.height / window.screen.width) + 'px';
      // (element as HTMLElement).style.transform = `scale(${window.screen.width / 1440})`;
    }
  }

  useEffect(() => {
    scaleBody();
    window.addEventListener('resize', scaleBody);
    return () => {
      window.removeEventListener('resize', scaleBody);
    };
  }, []);

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  return (
    <div className="app-container">
      <div
        className={`content ${transitionStage}`}
        onAnimationEnd={() => {
          if (transitionStage === "fadeOut") {
            setTransitionStage("fadeIn");
            setDisplayLocation(location);
          }
        }}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<QuotesComponent />} />
          <Route path="/authenticate" element={<AuthenticationComponent />} />
          <Route path="/signup" element={<SignupComponent />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </div>
  )
}

export default App