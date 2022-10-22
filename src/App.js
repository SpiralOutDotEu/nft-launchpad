import logo from './logo.svg';
import './App.css';

import Install from './components/Install';
import Home from './components/Home';

function App() {
  <html>
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
  </header>

  </html>
  if (window.ethereum) {
    return <Home />;
  } else {
    return <Install />;
  }
}

export default App;
