import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Loader } from '@react-three/drei';
import HumanBody from './components/HumanBody';
import ModelLoader from './components/ModelLoader';
import UIOverlay from './components/UIOverlay';
import SymptomModal from './components/SymptomModal';
import AIAnalysisModal from './components/AIAnalysisModal';
import ModelErrorBoundary from './components/ModelErrorBoundary';
import SubRegionModal from './components/SubRegionModal';

function App() {
  const [useRealistic, setUseRealistic] = useState(false);
  const [gender, setGender] = useState('female');

  const [selectedParts, setSelectedParts] = useState([]);
  const [symptomsMap, setSymptomsMap] = useState({});

  // Modal State
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [symptomModalOpen, setSymptomModalOpen] = useState(false);
  const [basePart, setBasePart] = useState(null); // The broad 3D model part clicked (e.g. 'LeftLeg')
  const [activeSubPart, setActiveSubPart] = useState(null); // The exact specific part selected (e.g. 'Thigh')
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const handleTogglePart = (partName) => {
    setBasePart(partName);
    setRegionModalOpen(true);
  };

  const handleSelectSubRegion = (subRegion) => {
    setRegionModalOpen(false);

    // Check if we've already selected this precise sub-region to edit its symptoms
    if (!selectedParts.includes(subRegion)) {
      setSelectedParts(prev => [...prev, subRegion]);
    }

    setActiveSubPart(subRegion);
    setSymptomModalOpen(true);
  };

  const handleAddSymptoms = (partName, symptomsList) => {
    setSymptomsMap(prev => ({
      ...prev,
      [partName]: symptomsList
    }));
  };

  const handleRemovePart = (partName) => {
    setSelectedParts(prev => prev.filter(p => p !== partName));
    setSymptomsMap(prev => {
      const newMap = { ...prev };
      delete newMap[partName];
      return newMap;
    });
  };

  const handleRemoveSymptom = (partName, symptomToRemove) => {
    setSymptomsMap(prev => ({
      ...prev,
      [partName]: prev[partName].filter(s => s !== symptomToRemove)
    }));
  };

  const handleClearSelection = () => {
    setSelectedParts([]);
    setSymptomsMap({});
  };

  return (
    <div className="relative w-screen h-screen bg-[#0f172a] overflow-hidden flex">
      {/* 3D Canvas Container */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <color attach="background" args={['#0f172a']} />
          <fog attach="fog" args={['#0f172a', 15, 30]} />

          <ambientLight intensity={0.5} />
          <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={2} color="#bae6fd" castShadow />
          <pointLight position={[-5, -5, -5]} intensity={1} color="#38bdf8" />

          <Suspense fallback={null}>
            <group position={[0, -1, 0]}>
              {useRealistic ? (
                <ModelErrorBoundary onRetry={() => setUseRealistic(false)}>
                  <ModelLoader
                    gender={gender}
                    selectedParts={selectedParts}
                    onTogglePart={handleTogglePart}
                  />
                </ModelErrorBoundary>
              ) : (
                <HumanBody
                  selectedParts={selectedParts}
                  onTogglePart={handleTogglePart}
                />
              )}

              <ContactShadows
                position={[0, -3.5, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
                far={4}
              />
            </group>

            <Environment preset="city" />
          </Suspense>

          <OrbitControls
            enablePan={true}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={4}
            maxDistance={25}
          />
        </Canvas>
      </div>

      {/* Floating UI Overlay */}
      <UIOverlay
        selectedParts={selectedParts}
        symptomsMap={symptomsMap}
        onRemovePart={handleRemovePart}
        onRemoveSymptom={handleRemoveSymptom}
        onClearSelection={handleClearSelection}
        onRunAnalysis={() => setAnalysisOpen(true)}
      />

      {/* Controls for Toggling Realism & Gender */}
      <div className="absolute top-6 left-6 flex flex-col gap-3 z-10 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/50 shadow-xl">
          <label className="text-xs font-semibold text-slate-300 uppercase mb-2 block">Model Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setUseRealistic(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${useRealistic ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              Realistic 3D
            </button>
            <button
              onClick={() => setUseRealistic(false)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${!useRealistic ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              Stylized Block
            </button>
          </div>
        </div>

        {useRealistic && (
          <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/50 shadow-xl transition-all">
            <label className="text-xs font-semibold text-slate-300 uppercase mb-2 block">Body Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender('female')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${gender === 'female' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
              >
                Female
              </button>
              <button
                onClick={() => setGender('male')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${gender === 'male' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
              >
                Male
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Region Selection Modal (Step 1) */}
      {regionModalOpen && basePart && (
        <SubRegionModal
          baseRegion={basePart}
          onClose={() => setRegionModalOpen(false)}
          onSelectSubRegion={handleSelectSubRegion}
        />
      )}

      {/* Symptom Check Modal (Step 2) */}
      {symptomModalOpen && activeSubPart && (
        <SymptomModal
          partName={activeSubPart}
          selectedSymptomsList={symptomsMap[activeSubPart] || []}
          onClose={() => setSymptomModalOpen(false)}
          onAddSymptoms={handleAddSymptoms}
        />
      )}

      {/* AI Analysis Modal */}
      {analysisOpen && (
        <AIAnalysisModal
          symptomsMap={symptomsMap}
          onClose={() => setAnalysisOpen(false)}
        />
      )}

      {/* 3D Loader */}
      <Loader
        containerStyles={{ background: '#0f172a' }}
        innerStyles={{ width: '300px' }}
        barStyles={{ background: '#0ea5e9', height: '4px' }}
        dataStyles={{ color: '#f8fafc', fontWeight: 500 }}
      />
    </div>
  );
}

export default App;
