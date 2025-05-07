import './App.css'
import { useEffect, useState } from 'react';
import QuotesComponent from './components/quotes/quotes.component';
import AuthenticationComponent from './components/Authentication/authentication.component';
import { Route, Routes, useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  const scaleBody = () => {
    console.log('hello');
    document.body.style.transform = `scale(${window.innerWidth / 1440})`;
    document.body.style.transformOrigin = 'top left';
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
        </Routes>
      </div>
    </div>
  )
}

export default App