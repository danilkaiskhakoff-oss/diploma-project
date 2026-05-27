import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import CheckpointScene from './CheckpointScene';

function CheckpointNode({ checkpoint, position, color, onClick, isCompleted }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          wireframe={!isCompleted}
        />
      </mesh>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2"
      >
        {checkpoint.title}
      </Text>
      {isCompleted && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.3}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
        >
          ✓
        </Text>
      )}
    </group>
  );
}

function Scene({ level, onCheckpointClick, completedCheckpoints }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={level.color} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      {level.checkpoints.map((checkpoint, index) => {
        const angle = (index / level.checkpoints.length) * Math.PI * 2;
        const radius = 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 1.5;
        return (
          <CheckpointNode
            key={checkpoint.id}
            checkpoint={checkpoint}
            position={[x, y, z]}
            color={level.color}
            onClick={() => onCheckpointClick(checkpoint)}
            isCompleted={completedCheckpoints.includes(checkpoint.id)}
          />
        );
      })}
      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

function Map3D({ level, onReset }) {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [completedCheckpoints, setCompletedCheckpoints] = useState([]);

  const handleCheckpointClick = (checkpoint) => {
    setSelectedCheckpoint(checkpoint);
  };

  const handleComplete = () => {
    if (selectedCheckpoint && !completedCheckpoints.includes(selectedCheckpoint.id)) {
      setCompletedCheckpoints([...completedCheckpoints, selectedCheckpoint.id]);
    }
    setSelectedCheckpoint(null);
  };

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0f]">
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <Suspense fallback={null}>
          <Scene
            level={level}
            onCheckpointClick={handleCheckpointClick}
            completedCheckpoints={completedCheckpoints}
          />
        </Suspense>
      </Canvas>

      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-[#1a1a2e] border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-[#00ff88] transition"
        >
          ← Назад к уровням
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10 bg-[#1a1a2e]/80 backdrop-blur px-4 py-2 rounded-lg border border-gray-800">
        <h2 className="text-lg font-bold" style={{ color: level.color }}>{level.name}</h2>
        <p className="text-xs text-gray-400">{completedCheckpoints.length}/{level.checkpoints.length} пройдено</p>
      </div>

      <AnimatePresence>
        {selectedCheckpoint && (
          <CheckpointScene
            checkpoint={selectedCheckpoint}
            levelColor={level.color}
            onClose={handleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Map3D;
