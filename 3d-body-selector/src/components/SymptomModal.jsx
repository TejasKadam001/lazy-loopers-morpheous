import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';

const symptomDatabase = {
    // Specific Forearm Symptoms as requested
    'Forearm': [
        'Forearm feels more sensitive',
        'Forearm feels weak',
        'Forearm hurts',
        'Forearm itches',
        'Forearm turning up',
        'Forearm turns in',
        'Lump on forearm',
        'Tingling or prickling in forearm',
        'Swelling'
    ],
    'Upper Arm (Bicep/Tricep)': ['Bicep shaking', 'Biceps hyporeflexia', 'Humeral swelling', 'Upper arm pain', 'Weakness', 'Muscle spasm'],
    'Elbow': ['Joint pain', 'Stiffness', 'Difficulty bending', 'Tennis elbow', 'Swelling'],
    'Wrist': ['Carpal tunnel pain', 'Stiffness', 'Clicking sound', 'Swelling', 'Numbness'],

    // Legs specific
    'Thigh': ['Burning feeling on thigh', "Can't feel hot or cold on thigh", 'Cramp in thigh muscle', 'Itching thigh', 'Large thigh muscle', 'Numb thigh muscle', 'Pain in thigh', 'Popping sound when turn thigh outward', 'Red thigh', 'Thigh muscle feels firm', 'Sciatica pain'],
    'Knee': ['Knee pain', 'Swelling', 'Joint stiffness', 'Popping or clicking', 'Instability'],
    'Calf': ['Calf cramp', 'Muscle tightness', 'Charlie horse', 'Swelling', 'Deep vein thrombosis pain'],

    // Head / Neck specific
    'Face': ['Facial pain', 'Jaw ache', 'Sinus pressure', 'Numbness', 'Twitching eye'],
    'Neck (General)': ['Stiff neck', 'Neck pain', 'Swollen glands', 'Limited mobility'],

    // Torso specific
    'Upper Chest': ['Chest pain', 'Shortness of breath', 'Palpitations', 'Tightness in chest', 'Heartburn'],
    'Lower Back (Lumbar)': ['Lower back pain', 'Lumbar strain', 'Shooting pain down leg', 'Stiffness after sitting'],

    'Pelvis (General)': ['Pelvic pain', 'Cramping', 'Groin pain', 'Lower abdominal pressure'],

    // Fallbacks
    'Default': ['Pain', 'Swelling', 'Redness', 'Numbness', 'Itching', 'Bruise', 'Rash', 'Stiffness', 'Weakness']
};

const SymptomModal = ({ partName, onClose, onAddSymptoms, selectedSymptomsList = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [localSelected, setLocalSelected] = useState([...selectedSymptomsList.filter(s => !s.startsWith('Custom: '))]);
    const [customSymptom, setCustomSymptom] = useState(() => {
        const existingCustom = selectedSymptomsList.find(s => s.startsWith('Custom: '));
        return existingCustom ? existingCustom.replace('Custom: ', '') : '';
    });

    // Determine symptoms to show. If specific part not found, use default and replace placeholders.
    let availableSymptoms = symptomDatabase[partName];
    if (!availableSymptoms) {
        // Fallback: Generate dynamic symptoms based on the part name 
        // Example: "Pain" -> "Pain in Left Shoulder"
        const friendlyName = partName.replace(' (General)', '').toLowerCase();
        availableSymptoms = symptomDatabase['Default'].map(sym => {
            if (sym === 'Pain') return `Pain in ${friendlyName}`;
            if (sym === 'Swelling') return `Swelling on ${friendlyName}`;
            if (sym === 'Numbness') return `Numbness in ${friendlyName}`;
            if (sym === 'Redness') return `${partName} looks red/inflamed`;
            return sym;
        });
    }

    const filteredSymptoms = availableSymptoms.filter(s =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSymptom = (symptom) => {
        if (localSelected.includes(symptom)) {
            setLocalSelected(localSelected.filter(s => s !== symptom));
        } else {
            setLocalSelected([...localSelected, symptom]);
        }
    };

    const handleSave = () => {
        let finalSymptoms = [...localSelected];
        if (customSymptom.trim()) {
            finalSymptoms.push(`Custom: ${customSymptom.trim()}`);
        }
        onAddSymptoms(partName, finalSymptoms);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4 fade-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {partName.replace('_', ' ')} Symptoms
                        </h2>
                        <p className="text-xs text-slate-500">Select all that apply or describe</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={`Search ${partName.toLowerCase()} symptoms...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredSymptoms.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-sm">
                            No symptoms found matching "{searchTerm}"
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-1">
                            {filteredSymptoms.map((symptom) => {
                                const isSelected = localSelected.includes(symptom);
                                return (
                                    <label
                                        key={symptom}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-sky-50 border-sky-100' : 'hover:bg-slate-50'
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleSymptom(symptom);
                                        }}
                                    >
                                        <div className={`flex items-center justify-center w-5 h-5 rounded border ${isSelected ? 'bg-sky-500 border-sky-500' : 'border-slate-300 bg-white'
                                            } transition-colors`}>
                                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className={`text-sm ${isSelected ? 'text-sky-900 font-medium' : 'text-slate-700'}`}>
                                            {symptom}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    {/* Custom Symptom Textarea */}
                    <div className="p-3 mt-2 border-t border-slate-100">
                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                            Or Describe Your Symptom
                        </label>
                        <textarea
                            value={customSymptom}
                            onChange={(e) => setCustomSymptom(e.target.value)}
                            placeholder="e.g., I have a sharp throbbing pain that worsens when I walk..."
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none resize-none"
                            rows="2"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                    >
                        {(localSelected.length > 0 || customSymptom.trim() !== '') ? `Save Symptoms` : 'Save'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SymptomModal;
