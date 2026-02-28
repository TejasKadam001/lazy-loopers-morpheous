import React from 'react';
import { Activity, X, HeartPulse } from 'lucide-react';

const UIOverlay = ({ selectedParts, symptomsMap, onClearSelection, onRemovePart, onRemoveSymptom, onRunAnalysis }) => {
    return (
        <div className="absolute top-0 right-0 h-full w-80 p-6 pointer-events-none z-10 flex flex-col justify-start">
            <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl flex flex-col h-full max-h-[90vh]">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
                    <div className="p-2 bg-sky-500/20 rounded-lg">
                        <HeartPulse className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                            Symptom Checker
                        </h1>
                        <p className="text-xs text-slate-400 font-medium">AI Healthcare System</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Activity className="w-4 h-4 text-sky-400" />
                            Selected Regions
                        </h2>
                        {selectedParts.length > 0 && (
                            <button
                                onClick={onClearSelection}
                                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {selectedParts.length === 0 ? (
                        <div className="text-center py-10 px-4 bg-slate-800/30 rounded-xl border border-slate-700/30 border-dashed">
                            <p className="text-sm text-slate-400">
                                Click on the 3D model to select specific body parts for analysis.
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {selectedParts.map((part) => {
                                const symptoms = symptomsMap[part] || [];

                                return (
                                    <li
                                        key={part}
                                        className="flex flex-col bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-200"
                                    >
                                        <div className="group flex items-center justify-between p-3 bg-slate-800 border-b border-slate-700/50">
                                            <span className="text-sm font-medium text-slate-200">{part.replace('_', ' ')}</span>
                                            <button
                                                onClick={() => onRemovePart(part)}
                                                className="p-1 opacity-0 group-hover:opacity-100 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 rounded transition-all duration-200"
                                                title="Remove Region"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Symptoms Sub-list */}
                                        <div className="p-2">
                                            {symptoms.length === 0 ? (
                                                <p className="text-xs text-slate-500 p-2 italic">No symptoms added</p>
                                            ) : (
                                                <ul className="space-y-1">
                                                    {symptoms.map(symp => (
                                                        <li key={symp} className="group flex items-center justify-between text-xs text-slate-300 bg-slate-900/50 p-2 rounded-md">
                                                            <span className="truncate pr-2">{symp}</span>
                                                            <button
                                                                onClick={() => onRemoveSymptom(part, symp)}
                                                                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {selectedParts.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-700/50">
                        <button
                            onClick={onRunAnalysis}
                            className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Run AI Analysis
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UIOverlay;
