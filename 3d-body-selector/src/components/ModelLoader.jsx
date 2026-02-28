import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

const ModelLoader = ({ gender = 'female', onTogglePart, selectedParts }) => {
    const modelRef = useRef();
    const [hoveredMesh, setHoveredMesh] = useState(null);

    const modelPath = gender === 'male' ? '/models/male.glb' : '/models/female.glb';

    // Load the model
    const { scene } = useGLTF(modelPath, true, true, (loader) => {
        // Add DRACO loader if compression was used
        // We assume standard GLTF for now but handle errors gracefully
    });

    // Deep clone to avoid WebGL context sharing issues across re-renders
    const clone = useMemo(() => {
        if (!scene) return null;
        try {
            return SkeletonUtils.clone(scene);
        } catch (e) {
            console.error("Failed to clone scene, returning original", e);
            return scene.clone();
        }
    }, [scene, gender]);

    useEffect(() => {
        if (clone) {
            clone.traverse((child) => {
                if (child.isMesh) {
                    // Store original material securely
                    if (!child.userData.originalMaterial) {
                        child.userData.originalMaterial = child.material ? child.material.clone() : null;
                    }

                    const isSelected = selectedParts.some(part => {
                        // Basic matching. Realistic models might use "Leg_L", "Chest_01", etc.
                        const p = part.toLowerCase();
                        const c = child.name.toLowerCase();
                        // Broad check
                        return c.includes(p) ||
                            (p === 'abdomen' && c.includes('stomach')) ||
                            (p === 'head' && (c.includes('face') || c.includes('skull')));
                    });

                    const isHovered = hoveredMesh === child.name;

                    if (child.material && child.userData.originalMaterial) {
                        if (isSelected) {
                            child.material.color.set('#0ea5e9');
                            child.material.emissive.set('#0284c7');
                            child.material.emissiveIntensity = 0.3;
                            child.material.transparent = true;
                            child.material.opacity = 0.9;
                        } else if (isHovered) {
                            child.material.color.set('#bae6fd');
                            child.material.emissive.set('#bae6fd');
                            child.material.emissiveIntensity = 0.15;
                            child.material.transparent = false;
                            child.material.opacity = 1;
                        } else {
                            child.material.copy(child.userData.originalMaterial);
                        }
                        child.material.needsUpdate = true;
                    }
                }
            });
        }
    }, [clone, selectedParts, hoveredMesh]);

    const handlePointerOver = (e) => {
        e.stopPropagation();
        if (e.object && e.object.name) {
            setHoveredMesh(e.object.name);
            document.body.style.cursor = 'pointer';
        }
    };

    const handlePointerOut = (e) => {
        e.stopPropagation();
        setHoveredMesh(null);
        document.body.style.cursor = 'auto';
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (e.object && e.object.name) {
            let meshName = e.object.name.toLowerCase();
            let friendlyName = null;

            // Define comprehensive mapping to catch standard realistic glb formats
            const bodyMap = {
                // Head and Face
                'head': ['head', 'skull', 'face', 'jaw', 'nose', 'eye', 'ear', 'mouth', 'lip', 'teeth', 'tongue', 'hair'],
                'neck': ['neck', 'cervical'],

                // Torso
                'chest': ['chest', 'breast', 'pectoral', 'rib', 'thorax', 'sternum', 'upper_torso'],
                'abdomen': ['abdomen', 'stomach', 'belly', 'waist', 'navel', 'pelvis', 'hip', 'lower_torso', 'torso', 'spine', 'back', 'lumbar'],

                // Arms setup base terms without L/R yet
                'Shoulder': ['shoulder', 'deltoid', 'clavicle'],
                'Arm': ['arm', 'bicep', 'tricep', 'forearm', 'elbow', 'wrist'],
                'Hand': ['hand', 'finger', 'thumb', 'palm', 'knuckle'],

                // Legs setup base terms without L/R yet
                'Leg': ['leg', 'thigh', 'calf', 'shin', 'knee', 'quadricep', 'hamstring', 'ankle'],
                'Foot': ['foot', 'toe', 'heel', 'sole']
            };

            // First, determine the base part
            for (const [key, searchTerms] of Object.entries(bodyMap)) {
                if (searchTerms.some(term => meshName.includes(term))) {
                    friendlyName = key;
                    break; // Stop at first match
                }
            }

            // Fallback: Coordinate-based matching for single-mesh models
            if (!friendlyName && (meshName.includes('body') || meshName.includes('mesh') || meshName === 'body__0' || meshName === '')) {
                if (e.point) {
                    const y = e.point.y;
                    const x = e.point.x;

                    console.log("Clicked Coordinates: Y=", y.toFixed(2), "X=", x.toFixed(2));

                    // Calibrated thresholds based on user input:
                    // Head: Y= -0.17
                    // Chest: Y= -1.13
                    // Hand: Y= -0.91, X= +/- 1.77
                    // Foot: Y= -4.38

                    const z = e.point.z;
                    const isBack = z < -0.05; // Negative Z typically means back of the model

                    if (y > -0.4) friendlyName = 'Head';
                    else if (y > -0.7) friendlyName = 'Neck';
                    else if (y > -1.7) {
                        if (Math.abs(x) > 1.0) friendlyName = 'Arm';
                        else if (isBack) friendlyName = 'Back';
                        else friendlyName = 'Chest';
                    }
                    else if (y > -2.3) {
                        if (Math.abs(x) > 1.2) friendlyName = 'Hand';
                        else if (Math.abs(x) > 0.8) friendlyName = 'Arm';
                        else if (isBack) friendlyName = 'Back';
                        else friendlyName = 'Abdomen';
                    }
                    else if (y > -4.0) {
                        if (Math.abs(x) > 1.3) friendlyName = 'Hand';
                        else friendlyName = 'Leg';
                    }
                    else friendlyName = 'Foot';
                }
            }

            // Apply side if it's a limb
            if (friendlyName && ['Shoulder', 'Arm', 'Hand', 'Leg', 'Foot'].includes(friendlyName)) {
                let isLeft = false;
                let isRight = false;

                if (meshName.includes('left') || meshName.includes('_l') || meshName.startsWith('l_')) isLeft = true;
                else if (meshName.includes('right') || meshName.includes('_r') || meshName.startsWith('r_')) isRight = true;
                else if (e.point && e.point.x > 0.1) isLeft = true;
                else if (e.point && e.point.x < -0.1) isRight = true;

                if (friendlyName === 'Shoulder') {
                    if (isLeft) friendlyName = 'Shoulder_L';
                    else if (isRight) friendlyName = 'Shoulder_R';
                } else {
                    // Combine them without spaces to match Stylized exactly
                    if (isLeft) friendlyName = 'Left' + friendlyName;
                    else if (isRight) friendlyName = 'Right' + friendlyName;
                }
            }

            if (friendlyName && !friendlyName.includes('Left') && !friendlyName.includes('Right') && !friendlyName.includes('Shoulder_')) {
                friendlyName = friendlyName.charAt(0).toUpperCase() + friendlyName.slice(1);
            }

            if (friendlyName) {
                onTogglePart(friendlyName);
            } else {
                console.log("Unmapped mesh clicked:", e.object.name, "at point", e.point);
                onTogglePart(e.object.name);
            }
        }
    };

    if (!clone) return null;

    return (
        <group onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onClick={handleClick}>
            <primitive
                ref={modelRef}
                object={clone}
                position={[0, -3.5, 0]}
                // Scale adjusted slightly, realistic models are often larger
                scale={[2.5, 2.5, 2.5]}
            />
        </group>
    );
};

// Error boundary preload wrapper
try {
    useGLTF.preload('/models/female.glb');
    useGLTF.preload('/models/male.glb');
} catch (e) {
    console.warn("Skipping preload");
}

export default ModelLoader;
