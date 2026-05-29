import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Точки атак (координаты стран)
const attackPoints = [
  { lat: 55.7558, lon: 37.6173, color: '#ff0000', country: 'Россия' },
  { lat: 39.9042, lon: 116.4074, color: '#ff4400', country: 'Китай' },
  { lat: 37.7749, lon: -122.4194, color: '#ff8800', country: 'США' },
  { lat: 51.5074, lon: -0.1278, color: '#ffaa00', country: 'Великобритания' },
  { lat: 48.8566, lon: 2.3522, color: '#ffcc00', country: 'Франция' },
  { lat: 35.6762, lon: 139.6503, color: '#ff0044', country: 'Япония' },
  { lat: -33.8688, lon: 151.2093, color: '#ff0088', country: 'Австралия' },
  { lat: 52.5200, lon: 13.4050, color: '#ff00aa', country: 'Германия' },
  { lat: 28.6139, lon: 77.2090, color: '#ff00ff', country: 'Индия' },
  { lat: -23.5505, lon: -46.6333, color: '#aa00ff', country: 'Бразилия' },
];

// Линии атак между странами
const attackLines = [
  [0, 2], [0, 3], [0, 4], [0, 7],
  [1, 2], [1, 5], [1, 6],
  [2, 3], [2, 4], [2, 8],
  [3, 7], [3, 4],
  [5, 6], [5, 2],
];

function latLonToVector3(lat, lon, radius = 5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function AttackPoint({ position, color }) {
  const mesh = useRef();
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.3);
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function AttackLine({ start, end, color }) {
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(startVec.length() * 1.3);
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
    return curve.getPoints(50);
  }, [start, end]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.6} />
    </line>
  );
}

function Globe() {
  const globeRef = useRef();
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Основная сфера */}
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        <meshPhongMaterial
          color="#1a3a5c"
          transparent
          opacity={0.3}
          wireframe={false}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[5.01, 32, 32]} />
        <meshBasicMaterial
          color="#00ff88"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Точки атак */}
      {attackPoints.map((point, i) => {
        const pos = latLonToVector3(point.lat, point.lon);
        return (
          <AttackPoint
            key={i}
            position={[pos.x, pos.y, pos.z]}
            color={point.color}
          />
        );
      })}
      
      {/* Линии атак */}
      {attackLines.map(([startIdx, endIdx], i) => {
        const start = latLonToVector3(attackPoints[startIdx].lat, attackPoints[startIdx].lon);
        const end = latLonToVector3(attackPoints[endIdx].lat, attackPoints[endIdx].lon);
        return (
          <AttackLine
            key={i}
            start={[start.x, start.y, start.z]}
            end={[end.x, end.y, end.z]}
            color={attackPoints[startIdx].color}
          />
        );
      })}
    </group>
  );
}

function CyberThreatMap() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        {/* Освещение */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
        
        {/* Звёзды */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Глобус с атаками */}
        <Globe />
        
        {/* Контролы */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Градиентный оверлей для лучшей читаемости */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
    </div>
  );
}

export default CyberThreatMap;
