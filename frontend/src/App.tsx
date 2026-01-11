import Home from "./pages/Home";
import FaultyTerminal from './components/FaultyTerminal';

function App() {
  return <>
    <div className="fixed inset-0 w-screen h-screen -z-10">
      <FaultyTerminal
        scale={1.2}
        digitSize={0.7}
        timeScale={0.2}
        scanlineIntensity={0.2}
        noiseAmp={0.6}
        brightness={0.1}
      />
    </div>
    <Home />
  </>;
}

export default App;
