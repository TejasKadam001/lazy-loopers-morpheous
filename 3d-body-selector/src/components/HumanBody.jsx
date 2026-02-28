import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

// Reusable Body Part Component
const BodyPart = ({ partName, position, scale, geometry = 'box', selectedParts, onTogglePart }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    const isSelected = selectedParts.includes(partName);

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={scale}
            onClick={(e) => {
                e.stopPropagation();
                onTogglePart(partName);
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(false);
            }}
            castShadow
            receiveShadow
        >
            {geometry === 'box' && <boxGeometry args={[1, 1, 1]} />}
            {geometry === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
            {geometry === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}

            <meshStandardMaterial
                color={isSelected ? '#0ea5e9' : hovered ? '#bae6fd' : '#e2e8f0'}
                roughness={isSelected ? 0.3 : 0.7}
                metalness={isSelected ? 0.2 : 0.1}
                emissive={isSelected ? '#0284c7' : '#000000'}
                emissiveIntensity={isSelected ? 0.5 : 0}
            />
        </mesh>
    );
};

const HumanBody = ({ selectedParts, onTogglePart }) => {
    const groupRef = useRef();

    // Subtle floating animation for the whole body
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t / 2) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Head */}
            <BodyPart
                partName="Head"
                position={[0, 3.2, 0]}
                scale={[1, 1.2, 1]}
                geometry="sphere"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />

            {/* Neck */}
            <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
            </mesh>

            {/* Chest (Front) */}
            <BodyPart
                partName="Chest"
                position={[0, 1.4, 0.3]}
                scale={[2.2, 1.4, 0.6]}
                geometry="box"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />

            {/* Upper/Mid Back (Rear) */}
            <BodyPart
                partName="Back"
                position={[0, 1.4, -0.3]}
                scale={[2.2, 1.4, 0.6]}
                geometry="box"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />

            {/* Abdomen (Front) */}
            <BodyPart
                partName="Abdomen"
                position={[0, -0.2, 0.3]}
                scale={[2, 1.6, 0.55]}
                geometry="box"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />

            {/* Lower Back / Pelvis (Rear) */}
            <BodyPart
                partName="Back"
                position={[0, -0.2, -0.25]}
                scale={[2, 1.6, 0.55]}
                geometry="box"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />

            {/* Left Shoulder */}
            <BodyPart
                partName="Shoulder_L"
                position={[-1.4, 1.8, 0]}
                scale={[0.8, 0.8, 0.8]}
                geometry="sphere"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />

            {/* Right Shoulder */}
            <BodyPart
                partName="Shoulder_R"
                position={[1.4, 1.8, 0]}
                scale={[0.8, 0.8, 0.8]}
                geometry="sphere"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />

            {/* Left Arm */}
            <BodyPart
                partName="LeftArm"
                position={[-1.6, 0.3, 0]}
                scale={[0.6, 2.2, 0.6]}
                geometry="cylinder"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />

            {/* Right Arm */}
            <BodyPart
                partName="RightArm"
                position={[1.6, 0.3, 0]}
                scale={[0.6, 2.2, 0.6]}
                geometry="cylinder"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />

            {/* Left Leg */}
            <BodyPart
                partName="LeftLeg"
                position={[-0.6, -2.2, 0]}
                scale={[0.8, 2.4, 0.8]}
                geometry="cylinder"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />

            {/* Right Leg */}
            <BodyPart
                partName="RightLeg"
                position={[0.6, -2.2, 0]}
                scale={[0.8, 2.4, 0.8]}
                geometry="cylinder"
                selectedParts={selectedParts}
                onTogglePart={onTogglePart}
            />
        </group>
    );
};

export default HumanBody;
