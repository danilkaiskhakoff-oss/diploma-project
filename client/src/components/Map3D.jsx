import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import CheckpointScene from './CheckpointScene';
import WarningModal from './WarningModal';
import { getProgress, getCompletedCheckpoints, saveProgress } from '../services/ProgressService';

function CheckpointNode({ checkpoint, position, color, onClick, progressData }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  const isCompleted = progressData?.completed;
  const scoreLabel = isCompleted && progressData?.totalScore !== undefined
    ? ` ${progressData.totalScore}/${progressData.totalPossible}`
    : '';
  const labelColor = isCompleted
    ? (progressData.totalScore === progressData.totalPossible ? '#00ff88' : '#ffaa00')
    : color;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          wireframe={!isCompleted}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} wireframe />
      </mesh>
      <Html position={[0, 1.2, 0]} center distanceFactor={10}>
        <div
          className="text-xs font-bold px-2 py-1 rounded whitespace-nowrap"
          style={{
            color: labelColor,
            textShadow: '0 0 10px rgba(0,0,0,0.9)',
            backgroundColor: 'rgba(10,10,15,0.7)',
            backdropFilter: 'blur(4px)',
            pointerEvents: 'none',
          }}
        >
          {isCompleted ? '✓ ' : ''}{checkpoint.title}{scoreLabel}
        </div>
      </Html>
    </group>
  );
}

function Scene({ level, onCheckpointClick, progress }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={level.color} />
      <pointLight position={[0, 0, 0]} intensity={0.3} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      {level.checkpoints.map((checkpoint, index) => {
        const angle = (index / level.checkpoints.length) * Math.PI * 2;
        const radius = 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 1.5;
        const cpProgress = progress?.[checkpoint.id];
        return (
          <CheckpointNode
            key={checkpoint.id}
            checkpoint={checkpoint}
            position={[x, y, z]}
            color={level.color}
            onClick={() => onCheckpointClick(checkpoint)}
            progressData={cpProgress}
          />
        );
      })}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

function Map3D({ level, onReset, user, onOpenAuth }) {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [progress, setProgress] = useState({});
  const [completedCheckpoints, setCompletedCheckpoints] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingCheckpoint, setPendingCheckpoint] = useState(null);

  const isAnonymous = user?.type === 'anonymous';

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user, level]);

  const loadProgress = async () => {
    if (!user) return;
    const prog = await getProgress(user.id, user.type === 'registered');
    setProgress(prog);
    const completed = getCompletedCheckpoints(prog, level.id);
    setCompletedCheckpoints(completed);
  };

  const handleCheckpointClick = (checkpoint) => {
    if (isAnonymous) {
      setPendingCheckpoint(checkpoint);
      setShowWarning(true);
    } else {
      setSelectedCheckpoint(checkpoint);
    }
  };

  const handleContinueAsGuest = () => {
    setShowWarning(false);
    if (pendingCheckpoint) {
      setSelectedCheckpoint(pendingCheckpoint);
      setPendingCheckpoint(null);
    }
  };

  const handleRegisterFromWarning = () => {
    setShowWarning(false);
    setPendingCheckpoint(null);
    onOpenAuth('register');
  };

  const handleComplete = async (data) => {
    if (selectedCheckpoint) {
      setCompletedCheckpoints(prev => prev.includes(selectedCheckpoint.id) ? prev : [...prev, selectedCheckpoint.id]);
    }
    if (user && selectedCheckpoint && data) {
      await saveProgress(user.id, user.type === 'registered', level.id, selectedCheckpoint.id, data);
      // Reload progress to update the map
      await loadProgress();
    }
    setSelectedCheckpoint(null);
  };

  const isSimulation = selectedCheckpoint?.type === 'simulation';

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0f] overflow-hidden">
      {!isSimulation && (
        <Canvas camera={{ position: [0, 4, 14], fov: 60 }} gl={{ antialias: true }}>
          <color attach="background" args={['#0a0a0f']} />
          <fog attach="fog" args={['#0a0a0f', 20, 50]} />
          <Suspense fallback={null}>
            <Scene
              level={level}
              onCheckpointClick={handleCheckpointClick}
              progress={progress[level.id] || {}}
            />
          </Suspense>
        </Canvas>
      )}

      {!isSimulation && (
        <>
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={onReset}
              className="px-4 py-2 bg-[#1a1a2e] border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-[#00ff88] transition text-sm"
            >
              ← Назад к уровням
            </button>
          </div>

          <div className="absolute top-4 right-4 z-10 bg-[#1a1a2e]/80 backdrop-blur px-4 py-2 rounded-lg border border-gray-800">
            <h2 className="text-lg font-bold" style={{ color: level.color }}>{level.name}</h2>
            <p className="text-xs text-gray-400">{completedCheckpoints.length}/{level.checkpoints.length} пройдено</p>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-[#1a1a2e]/60 backdrop-blur px-4 py-2 rounded-lg border border-gray-800 text-center">
            <p className="text-xs text-gray-400">️ Вращайте камеру • Нажмите на точку</p>
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedCheckpoint && (
          <CheckpointScene
            checkpoint={{ ...selectedCheckpoint, _levelId: level.id }}
            levelColor={level.color}
            onClose={handleComplete}
            user={user}
          />
        )}
      </AnimatePresence>

      <WarningModal
        isOpen={showWarning}
        onClose={() => { setShowWarning(false); setPendingCheckpoint(null); }}
        onContinue={handleContinueAsGuest}
        onRegister={handleRegisterFromWarning}
      />
    </div>
  );
}

export default Map3D;
