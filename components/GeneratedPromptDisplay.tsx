import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface GeneratedPromptDisplayProps {
  promptText: string;
  promptJson: string;
  isLoading: boolean;
  error: string | null;
}

type ViewType = 'text' | 'json';

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse-fast">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
    </div>
);

export const GeneratedPromptDisplay: React.FC<GeneratedPromptDisplayProps> = ({ promptText, promptJson, isLoading, error }) => {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<ViewType>('text');

  const hasContent = !isLoading && !error && (promptText || promptJson);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  useEffect(() => {
    // Reset copied state and view when a new prompt is generated
    setCopied(false);
    setView('text');
  }, [promptText]);

  const handleCopy = () => {
    const contentToCopy = view === 'text' ? promptText : promptJson;
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (error) {
      return <p className="text-red-400">{error}</p>;
    }
    if (view === 'text' && promptText) {
      return <p className="text-slate-300 whitespace-pre-wrap">{promptText}</p>;
    }
    if (view === 'json' && promptJson) {
      return (
        <pre className="text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto bg-slate-900/50 p-4 rounded-md">
          <code>{promptJson}</code>
        </pre>
      );
    }
    return <p className="text-slate-500 text-center">Votre prompt généré apparaîtra ici.</p>;
  };

  return (
    <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-6 relative flex flex-col">
      {hasContent && (
        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
          <div className="flex space-x-1 bg-slate-700 p-1 rounded-md">
            <button 
                onClick={() => setView('text')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
            >
                Prompt
            </button>
            <button
                onClick={() => setView('json')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
            >
                JSON
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300"
            aria-label="Copier le contenu"
          >
            {copied ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
          </button>
        </div>
      )}
      <div className="w-full min-h-[100px] flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};