
import React from 'react';
import { PromptType } from '../types';
import { PhotoIcon, VideoIcon, AutomationIcon, ActionIcon } from './icons';

interface PromptTypeSelectorProps {
  onSelectType: (type: PromptType) => void;
}

const promptTypeOptions = [
  { type: PromptType.Photo, icon: PhotoIcon, description: "Générez des prompts pour la création d'images." },
  { type: PromptType.Video, icon: VideoIcon, description: "Créez des scénarios et des prompts pour des vidéos." },
  { type: PromptType.Automation, icon: AutomationIcon, description: "Élaborez des prompts pour des tâches automatisées." },
  { type: PromptType.Action, icon: ActionIcon, description: "Définissez des prompts pour des actions spécifiques." },
];

export const PromptTypeSelector: React.FC<PromptTypeSelectorProps> = ({ onSelectType }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">
        1. Choisissez un type de prompt
      </h2>
      <p className="text-center text-slate-400 mb-8">Sélectionnez la catégorie qui correspond le mieux à votre besoin.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promptTypeOptions.map(({ type, icon: Icon, description }) => (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className="group bg-slate-800/50 hover:bg-slate-700/70 border border-slate-700 rounded-lg p-6 text-left transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
          >
            <div className="flex items-center">
              <div className="bg-slate-700 group-hover:bg-indigo-600 rounded-lg p-3 transition-colors duration-300">
                <Icon className="h-8 w-8 text-indigo-400 group-hover:text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-semibold text-slate-100">{type}</h3>
                <p className="text-slate-400 mt-1">{description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
