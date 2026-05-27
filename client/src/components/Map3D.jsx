import { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import CheckpointScene from './CheckpointScene';

function CheckpointNode({ checkpoint, position, color, onClick, isCompleted, labelRef }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position} ref={labelRef}>
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
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} wireframe />
      </mesh>
    </group>
  );
}

function Scene({ level, onCheckpointClick, completedCheckpoints, nodeRefs }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={level.color} />
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#ffffff" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
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
            labelRef={(el) => { if (el) nodeRefs.current[index] = el; }}
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

function Labels({ level, nodeRefs, canvasRef, completedCheckpoints }) {
  const [positions, setPositions] = useState([]);
  const { camera, size, gl } = useThree();

  useFrame(() => {
    const newPositions = [];
    nodeRefs.current.forEach((ref, index) => {
      if (ref && ref.parent) {
        const worldPos = new THREE.Vector3();
        ref.getWorldPosition(worldPos);
        worldPos.y += 1.2;

        const screenPos = worldPos.clone().project(camera);
        const x = ((screenPos.x + 1) / 2) * size.width;
        const y = ((-screenPos.y + 1) / 2) * size.height;

        newPositions.push({
          x,
          y,
          title: level.checkpoints[index].title,
          completed: completedCheckpoints.includes(level.checkpoints[index].id),
        });
      }
    });
    setPositions(newPositions);
  });

  return (
    <>
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          }}
        >
          <div className="text-center whitespace-nowrap">
            <div
              className="text-xs font-bold px-2 py-1 rounded"
              style={{
                color: pos.completed ? '#00ff88' : level.color,
                textShadow: '0 0 10px rgba(0,0,0,0.8)',
                backgroundColor: 'rgba(10,10,15,0.6)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {pos.completed ? '✓ ' : ''}{pos.title}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Загрузка сцены...</p>
      </div>
    </div>
  );
}

function Map3D({ level, onReset }) {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [completedCheckpoints, setCompletedCheckpoints] = useState([]);
  const [canvasReady, setCanvasReady] = useState(false);
  const nodeRefs = useRef([]);
  const canvasContainerRef = useRef();

  const handleCheckpointClick = (checkpoint) => {
    setSelectedCheckpoint(checkpoint);
  };

  const handleComplete = () => {
    if (selectedCheckpoint && !completedCheckpoints.includes(selectedCheckpoint.id)) {
      setCompletedCheckpoints([...completedCheckpoints, selectedCheckpoint.id]);
    }
    setSelectedCheckpoint(null);
  };

  const handleCanvasCreated = () => {
    setCanvasReady(true);
  };

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0f] overflow-hidden">
      <div ref={canvasContainerRef} className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 4, 14], fov: 60 }}
          onCreated={handleCanvasCreated}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={['#0a0a0f']} />
          <fog attach="fog" args={['#0a0a0f', 20, 50]} />
          <Suspense fallback={null}>
            <Scene
              level={level}
              onCheckpointClick={handleCheckpointClick}
              completedCheckpoints={completedCheckpoints}
              nodeRefs={nodeRefs}
            />
          </Suspense>
          <Labels
            level={level}
            nodeRefs={nodeRefs}
            canvasRef={canvasContainerRef}
            completedCheckpoints={completedCheckpoints}
          />
        </Canvas>
      </div>

      {!canvasReady && <LoadingFallback />}

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
        <p className="text-xs text-gray-400">🖱️ Вращайте камеру мышкой • Нажмите на точку для изучения</p>
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
