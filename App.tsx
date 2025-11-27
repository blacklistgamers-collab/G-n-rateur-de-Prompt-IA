import React, { useState, useCallback } from 'react';
import { PromptType } from './types';
import { generateOptimalPrompt, GenerationResult } from './services/geminiService';
import { PromptTypeSelector } from './components/PromptTypeSelector';
import { FileUpload } from './components/FileUpload';
import { GeneratedPromptDisplay } from './components/GeneratedPromptDisplay';

const App: React.FC = () => {
  const [promptType, setPromptType] = useState<PromptType | null>(null);
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePrompt = useCallback(async () => {
    if (!promptType || !description) return;

    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const result = await generateOptimalPrompt({ promptType, description, file });
      setGeneratedResult(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Une erreur inconnue est survenue.';
      setError(`La génération a échoué. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [promptType, description, file]);

  const resetSelection = () => {
      setPromptType(null);
      setDescription('');
      setFile(null);
      setGeneratedResult(null);
      setError(null);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8">
      <main className="max-w-4xl mx-auto flex flex-col items-center space-y-12">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 pb-2">
            Générateur de Prompt IA
          </h1>
          <p className="text-lg text-slate-300">
            Créez des prompts parfaits pour l'IA en quelques étapes simples.
          </p>
        </header>

        {!promptType ? (
          <PromptTypeSelector onSelectType={setPromptType} />
        ) : (
          <div className="w-full space-y-10 p-4 sm:p-8 bg-slate-800/30 rounded-xl border border-slate-700 shadow-2xl shadow-slate-900/50">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">2. Décrivez votre objectif</h2>
                        <p className="text-slate-400">Pour le type : <span className="font-semibold text-indigo-400">{promptType}</span></p>
                    </div>
                    <button onClick={resetSelection} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Changer le type</button>
                </div>
              
                <div className="space-y-6">
                    <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={`Ex: Je veux une photo d'un astronaute se relaxant sur une plage martienne, style rétro-futuriste...`}
                    className="w-full h-32 p-4 bg-slate-800/80 border border-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow text-slate-200 placeholder-slate-500"
                    />

                    <FileUpload file={file} onFileChange={setFile} />

                    <button
                    onClick={handleGeneratePrompt}
                    disabled={isLoading || !description}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                    {isLoading ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Génération en cours...
                        </>
                    ) : (
                        'Générer le Prompt'
                    )}
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-4">3. Résultat</h2>
                <GeneratedPromptDisplay 
                  promptText={generatedResult?.text ?? ''}
                  promptJson={generatedResult?.json ?? ''}
                  isLoading={isLoading} 
                  error={error} 
                />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;