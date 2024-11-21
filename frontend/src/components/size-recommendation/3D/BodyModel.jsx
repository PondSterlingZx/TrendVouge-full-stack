import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const HumanBody = ({ measurements }) => {
  const bodyRef = useRef();
  
  // Scale factors to convert measurements to 3D model proportions
  const scale = {
    bust: measurements.bust / 100,
    waist: measurements.waist / 100,
    hip: measurements.hip / 100
  };

  useFrame((state) => {
    if (bodyRef.current) {
      bodyRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={bodyRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#f0d6b9" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 32]} />
        <meshStandardMaterial color="#f0d6b9" />
      </mesh>

      {/* Shoulders */}
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[scale.bust * 0.4, scale.bust * 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#f0d6b9" />
      </mesh>

      {/* Upper Torso (Bust) */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[scale.bust * 0.45, scale.bust * 0.42, 0.5, 32]} />
        <meshStandardMaterial color="#f0d6b9" />
      </mesh>

      {/* Waist */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[scale.waist * 0.4, scale.waist * 0.38, 0.4, 32]} />
        <meshStandardMaterial color="#f0d6b9" />
      </mesh>

      {/* Hips */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[scale.hip * 0.42, scale.hip * 0.4, 0.6, 32]} />
        <meshStandardMaterial color="#f0d6b9" />
      </mesh>

      {/* Upper Legs */}
      <group>
        {/* Left Leg */}
        <mesh position={[-0.2, 0.4, 0]}>
          <cylinderGeometry args={[0.15, 0.12, 0.8, 32]} />
          <meshStandardMaterial color="#f0d6b9" />
        </mesh>
        {/* Right Leg */}
        <mesh position={[0.2, 0.4, 0]}>
          <cylinderGeometry args={[0.15, 0.12, 0.8, 32]} />
          <meshStandardMaterial color="#f0d6b9" />
        </mesh>
      </group>

      {/* Upper Arms */}
      <group>
        {/* Left Arm */}
        <mesh position={[-scale.bust * 0.4, 1.7, 0]} rotation={[0, 0, -Math.PI * 0.15]}>
          <cylinderGeometry args={[0.08, 0.07, 0.6, 32]} />
          <meshStandardMaterial color="#f0d6b9" />
        </mesh>
        {/* Right Arm */}
        <mesh position={[scale.bust * 0.4, 1.7, 0]} rotation={[0, 0, Math.PI * 0.15]}>
          <cylinderGeometry args={[0.08, 0.07, 0.6, 32]} />
          <meshStandardMaterial color="#f0d6b9" />
        </mesh>
      </group>

      {/* Measurement Indicators */}
      <group>
        {/* Bust Indicator */}
        <mesh position={[0, 1.6, scale.bust * 0.45]} scale={[0.1, 0.1, 0.1]}>
          <sphereGeometry />
          <meshStandardMaterial color="red" />
        </mesh>

        {/* Waist Indicator */}
        <mesh position={[0, 1.2, scale.waist * 0.4]} scale={[0.1, 0.1, 0.1]}>
          <sphereGeometry />
          <meshStandardMaterial color="blue" />
        </mesh>

        {/* Hip Indicator */}
        <mesh position={[0, 0.8, scale.hip * 0.42]} scale={[0.1, 0.1, 0.1]}>
          <sphereGeometry />
          <meshStandardMaterial color="green" />
        </mesh>
      </group>
    </group>
  );
};

const Body3DVisualizer = ({ measurements }) => {
  return (
    <div className="w-full h-full relative bg-gray-50 rounded-lg">
      <Canvas
        camera={{ position: [0, 1, 4], fov: 45 }}
        style={{ background: '#f8fafc' }}
      >
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />
        <directionalLight position={[0, 5, 5]} intensity={0.5} />
        
        {/* Human Body Model */}
        <HumanBody measurements={measurements} />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* Measurement Labels */}
      <div className="absolute top-4 right-4 bg-white/80 p-3 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm">Bust: {measurements.bust}cm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm">Waist: {measurements.waist}cm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm">Hip: {measurements.hip}cm</span>
        </div>
      </div>
    </div>
  );
};

export default Body3DVisualizer;