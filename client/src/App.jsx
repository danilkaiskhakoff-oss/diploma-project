import { useState } from 'react';
import LevelSelect from './components/LevelSelect';
import Map3D from './components/Map3D';

function App() {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleReset = () => {
    setSelectedLevel(null);
  };

  if (!selectedLevel) {
    return <LevelSelect onSelectLevel={setSelectedLevel} />;
  }

  return <Map3D level={selectedLevel} onReset={handleReset} />;
}

export default App;
