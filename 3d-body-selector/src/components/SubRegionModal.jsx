import React from 'react';
import { X, ChevronRight, MapPin } from 'lucide-react';

const regionDatabase = {
    'Head': ['Head (General)', 'Face', 'Scalp', 'Forehead', 'Eyes', 'Ears', 'Nose', 'Mouth/Jaw', 'Back of Head'],
    'Neck': ['Neck (General)', 'Front of Neck (Throat)', 'Back of Neck', 'Base of Neck'],
    'Chest': ['Chest (General)', 'Upper Chest', 'Lower Chest (Ribs)'],
    'Abdomen': ['Abdomen (General)', 'Upper Abdomen', 'Lower Abdomen', 'Pelvis', 'Groin', 'Flank/Side'],
    'Back': ['Upper Back', 'Middle Back', 'Lower Back (Lumbar)', 'Tailbone'],
    'Pelvis': ['Pelvis (General)', 'Groin', 'Hips', 'Genitals'],
    'Buttocks': ['Buttocks (General)'],
    'Shoulder_L': ['Left Shoulder (General)', 'Front Shoulder', 'Back Shoulder', 'Shoulder Joint'],
    'Shoulder_R': ['Right Shoulder (General)', 'Front Shoulder', 'Back Shoulder', 'Shoulder Joint'],
    'LeftArm': ['Left Arm (General)', 'Upper Arm (Bicep/Tricep)', 'Elbow', 'Forearm', 'Wrist'],
    'RightArm': ['Right Arm (General)', 'Upper Arm (Bicep/Tricep)', 'Elbow', 'Forearm', 'Wrist'],
    'Hand': ['Hand (General)', 'Palm', 'Back of Hand', 'Fingers', 'Thumb', 'Knuckles'],
    'LeftLeg': ['Left Leg (General)', 'Thigh', 'Hamstring', 'Knee', 'Popliteal (Back of knee)', 'Shin', 'Calf', 'Ankle'],
    'RightLeg': ['Right Leg (General)', 'Thigh', 'Hamstring', 'Knee', 'Popliteal (Back of knee)', 'Shin', 'Calf', 'Ankle'],
    'Foot': ['Foot (General)', 'Heel', 'Sole', 'Top of Foot', 'Toes']
};

const SubRegionModal = ({ baseRegion, onClose, onSelectSubRegion }) => {
    // Standardize naming if needed (e.g. LeftLeg -> Left Leg)
    const displayName = baseRegion.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim();

    // Get sub regions or default to just the base region if none defined
    const subRegions = regionDatabase[baseRegion] || [displayName];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <MapPin className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                                {displayName}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">Select specific area</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    <div className="grid grid-cols-1 gap-1">
                        {subRegions.map((subRegion, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSelectSubRegion(subRegion)}
                                className="flex items-center justify-between w-full p-4 text-left rounded-lg bg-white hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
                            >
                                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-900">
                                    {subRegion}
                                </span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubRegionModal;
