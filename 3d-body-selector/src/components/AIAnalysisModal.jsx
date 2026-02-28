import React, { useState, useEffect } from 'react';
import { X, Cpu, AlertTriangle, ChevronRight, ChevronLeft, Info, Activity } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const AIAnalysisModal = ({ symptomsMap, onClose }) => {
    const [status, setStatus] = useState('analyzing');
    const [results, setResults] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        let isMounted = true;

        const analyzeSymptoms = async () => {
            try {
                // Formatting input into readable list for LLM
                let consultationText = "";
                Object.entries(symptomsMap).forEach(([part, syms]) => {
                    const friendlyPartName = part.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim();
                    consultationText += `Area: ${friendlyPartName}\nSymptoms: ${syms.join(', ')}\n\n`;
                });

                if (!import.meta.env.VITE_GEMINI_API_KEY) {
                    throw new Error("Missing Gemini API Key in .env file.");
                }

                const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

                const prompt = `
You are a highly advanced AI clinical diagnostic engine designed to mimic professional symptom checkers like WebMD.
A user has selected specific body regions and symptoms. 

User Input:
${consultationText}

Your task is to analyze these highly localized symptoms and provide the top 2 matching potential medical conditions. 

Rules:
1. You MUST return strictly valid JSON.
2. The JSON must be an array of objects.
3. The response should NOT contain markdown formatting like \`\`\`json. Return RAW JSON.
4. Each object must follow EXACTLY this schema:
{
  "id": "A unique string ID like c1, c2",
  "condition": "The primary medical name of the condition (e.g., 'Lateral Epicondylitis')",
  "synonyms": "Common names separated by | (e.g., 'Tennis Elbow | Elbow Tendinitis')",
  "matchText": "Either 'High match', 'Moderate match', or 'Fair match'",
  "matchLevel": A number from 1 to 3 (1 = Fair, 3 = High),
  "details": {
    "symptoms": "A comma separated string of typical symptoms for this condition",
    "howCommon": "A short realistic statistic on how common this condition is",
    "overview": "A brief, one-paragraph clinical overview of the condition."
  },
  "treatment": [
    "Array of 3-4 specific, actionable home healthcare measures to alleviate mild symptoms (e.g. icing, stretching techniques). Be medically responsible."
  ]
}

Only return the raw JSON array.
`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                    }
                });

                const rawJsonStr = response.text().trim();
                const diagnoses = JSON.parse(rawJsonStr);

                if (isMounted) {
                    setResults(diagnoses);
                    if (diagnoses.length > 0) setSelectedId(diagnoses[0].id);
                    setStatus('complete');
                }

            } catch (error) {
                console.error("AI Analysis Error:", error);

                // Fallback structured data if API fails
                if (isMounted) {
                    setResults([{
                        id: 'fallback1',
                        condition: 'Needs Manual Review',
                        synonyms: 'General Consultation | Medical Assessment',
                        matchText: 'Information Required',
                        matchLevel: 1,
                        details: {
                            symptoms: Object.values(symptomsMap).flat().join(', '),
                            howCommon: 'Varies by individual case.',
                            overview: 'Due to a connection issue or missing API key, the AI analysis could not complete. However, your localized symptoms have been recorded. Please consult a medical professional for an accurate diagnosis.'
                        },
                        treatment: [
                            'Rest the affected area and avoid aggravating movements.',
                            'Schedule an appointment with a healthcare provider for an evaluation.',
                            'If symptoms are severe, seek immediate emergency medical care.'
                        ]
                    }]);
                    setSelectedId('fallback1');
                    setStatus('complete');
                }
            }
        };

        analyzeSymptoms();

        return () => { isMounted = false; };
    }, [symptomsMap]);

    const activeCondition = results.find(r => r.id === selectedId);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-300 border border-slate-200">
                {/* Header (Top Nav) */}
                <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50 relative z-10">
                    <div className="flex items-center gap-10">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="text-sky-500 w-6 h-6" /> AI Symptom Checker <span className="text-[10px] text-sky-500 font-extrabold uppercase tracking-widest ml-1 mt-1">WITH BODY MAP</span>
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {status === 'analyzing' ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white space-y-6">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-t-2 border-sky-500 animate-[spin_1s_linear_infinite]"></div>
                            <div className="absolute inset-2 rounded-full border-r-2 border-indigo-400 animate-[spin_1.5s_linear_infinite_reverse]"></div>
                            <Cpu className="absolute inset-0 m-auto w-8 h-8 text-sky-500 animate-pulse" />
                        </div>
                        <p className="text-slate-600 font-medium text-lg animate-pulse">Running advanced AI analysis...</p>
                        <p className="text-slate-400 text-sm">Matching symptoms to intelligent clinical databases</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-hidden flex bg-slate-50 relative">
                        {/* Left Sidebar: Conditions List */}
                        <div className="w-full max-w-[400px] border-r bg-white overflow-y-auto p-6 flex flex-col pt-8 space-y-2 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">

                            <div className="bg-amber-50/80 rounded border border-amber-100 p-3 text-[13px] text-amber-900 mb-8 mx-auto w-full text-center">
                                You received few matches. Try <strong className="font-semibold cursor-pointer border-b border-amber-900 border-dashed">adding more symptoms</strong> to improve your results.
                            </div>

                            <div className="mt-8 mb-4">
                                <h3 className="text-lg font-normal text-slate-700 mb-1">Conditions that match your symptoms</h3>
                                <button className="text-[11px] font-bold text-sky-500 flex items-center gap-1 uppercase tracking-wider mb-6">
                                    UNDERSTANDING YOUR RESULTS <Info className="w-3.5 h-3.5 bg-sky-500 text-white rounded-full p-[2px] ml-1" />
                                </button>

                                <div className="space-y-4 relative w-full pr-4">
                                    {results.map(res => {
                                        const isSelected = selectedId === res.id;
                                        return (
                                            <div
                                                key={res.id}
                                                onClick={() => setSelectedId(res.id)}
                                                className={`relative overflow-visible cursor-pointer border-t border-b hover:bg-slate-50 transition-colors p-5 -mx-4 group ${isSelected ? 'bg-slate-50/50' : 'bg-white'}`}
                                            >
                                                {/* Tooltip-style arrow extending out of the box when selected */}
                                                {isSelected && (
                                                    <div className="absolute -right-[15px] top-1/2 -translate-y-1/2 w-8 h-8 bg-[#f8fafc] rotate-45 border-t border-r border-slate-200 z-20"></div>
                                                )}

                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-center pr-2">
                                                        <h4 className="font-bold text-slate-600 text-[15px]">{res.condition}</h4>
                                                        {!isSelected && <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-3 mb-1">
                                                        <div className={`h-[5px] rounded-full w-[24px] ${res.matchLevel >= 1 ? 'bg-[#00a3ad]' : 'bg-slate-200'}`}></div>
                                                        <div className={`h-[5px] rounded-full w-[24px] ${res.matchLevel >= 2 ? 'bg-[#00a3ad]' : 'bg-slate-200'}`}></div>
                                                        <div className={`h-[5px] rounded-full w-[24px] ${res.matchLevel >= 3 ? 'bg-[#00a3ad]' : 'bg-slate-200'}`}></div>
                                                        <div className="h-[5px] rounded-full w-[12px] bg-slate-200"></div>
                                                    </div>
                                                    <p className="text-[13px] text-slate-500">{res.matchText}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="mt-8">
                                <button className="flex items-center gap-2 px-5 py-2 border rounded border-slate-200 text-slate-600 hover:bg-slate-50 text-sm">
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </button>
                            </div>
                        </div>

                        {/* Right Content Area: Details */}
                        <div className="flex-1 overflow-y-auto bg-white p-10 pt-12 relative z-0">
                            {activeCondition && (
                                <div className="max-w-3xl animate-in fade-in duration-300 ml-8">

                                    <h1 className="text-3xl font-extrabold text-slate-700 tracking-tight mb-2">{activeCondition.condition}</h1>
                                    <p className="text-[14px] leading-relaxed text-slate-600 mb-6">{activeCondition.synonyms}</p>

                                    {/* Tabs */}
                                    <div className="flex border-b border-slate-200 gap-10 mb-8 mt-4">
                                        <button
                                            onClick={() => setActiveTab('details')}
                                            className={`pb-3 text-[13px] font-bold tracking-wider uppercase transition-colors ${activeTab === 'details' ? 'border-b-[3px] border-[#00a3ad] text-slate-700' : 'text-[#00a3ad] hover:text-[#008992]'}`}
                                        >
                                            CONDITION DETAILS
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('treatment')}
                                            className={`pb-3 text-[13px] font-bold tracking-wider uppercase transition-colors ${activeTab === 'treatment' ? 'border-b-[3px] border-[#00a3ad] text-slate-700' : 'text-[#00a3ad] hover:text-[#008992]'}`}
                                        >
                                            TREATMENT OPTIONS
                                        </button>
                                    </div>

                                    {activeTab === 'details' ? (
                                        <div className="space-y-8 pr-12">
                                            <section>
                                                <h3 className="text-lg font-bold text-slate-700 mb-4">Symptoms</h3>
                                                <p className="text-slate-600 leading-relaxed text-[15px]">{activeCondition.details.symptoms}</p>
                                            </section>
                                            <section>
                                                <h3 className="text-lg font-bold text-slate-700 mb-4">How Common</h3>
                                                <p className="text-slate-600 leading-relaxed text-[15px]">{activeCondition.details.howCommon}</p>
                                            </section>
                                            <section>
                                                <h3 className="text-lg font-bold text-slate-700 mb-4">Overview</h3>
                                                <p className="text-slate-600 leading-relaxed text-[15px]">
                                                    {activeCondition.details.overview} <span className="text-[#00a3ad] cursor-pointer hover:underline font-medium">read more {'>'}</span>
                                                </p>
                                            </section>

                                            <div className="mt-14 pt-8 border-t border-slate-200/60 max-w-lg relative">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-[17px] font-bold text-slate-700">Do you think you have this condition?</h3>
                                                    <X className="w-4 h-4 text-slate-400 font-bold absolute right-0 top-10 cursor-pointer" />
                                                </div>
                                                <div className="flex gap-4">
                                                    <button className="flex-1 py-2.5 bg-[#f0f4f8] hover:bg-[#e2e8f0] text-slate-600 rounded transition-colors text-[15px]">Yes</button>
                                                    <button className="flex-1 py-2.5 bg-[#f0f4f8] hover:bg-[#e2e8f0] text-slate-600 rounded transition-colors text-[15px]">No</button>
                                                    <button className="flex-1 py-2.5 bg-[#f0f4f8] hover:bg-[#e2e8f0] text-slate-600 rounded transition-colors text-[15px]">Maybe</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8 pr-12">
                                            <section>
                                                <h3 className="text-lg font-bold text-slate-700 mb-6">Actionable Home Measures</h3>
                                                <ul className="space-y-6">
                                                    {activeCondition.treatment.map((step, idx) => (
                                                        <li key={idx} className="flex gap-5 items-start">
                                                            <div className="w-8 h-8 rounded-full bg-[#e6f6f7] text-[#00a3ad] flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-sm border border-[#00a3ad]/20">
                                                                {idx + 1}
                                                            </div>
                                                            <p className="text-slate-600 text-[15px] leading-relaxed pt-1 font-medium">{step}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                            <div className="mt-10 p-5 bg-[#fff8eb] border border-[#f5cb98] rounded flex gap-4 text-[#8a6026] items-start shadow-sm max-w-lg">
                                                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 opacity-80" />
                                                <p className="text-[14px] leading-relaxed font-medium">These measures are for mild symptoms. If pain persists or worsens, consult a physical therapist or clear it with your general practitioner immediately.</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAnalysisModal;
