
import React, { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { UploadIcon, FileIcon } from './icons';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    } else {
        onFileChange(null);
    }
  };

  const handleDrag = useCallback((e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  }, [onFileChange]);
  
  const handleRemoveFile = () => {
    onFileChange(null);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex justify-center w-full h-48 px-4 transition bg-slate-800/80 border-2 ${isDragging ? 'border-indigo-500' : 'border-slate-700'} border-dashed rounded-md appearance-none cursor-pointer hover:border-indigo-600 focus:outline-none`}
      >
        {!file ? (
            <span className="flex flex-col items-center justify-center space-y-2 text-center">
                <UploadIcon className={`w-10 h-10 ${isDragging ? 'text-indigo-500' : 'text-slate-500'}`} />
                <span className="font-medium text-slate-300">
                    Glissez-déposez un fichier, ou{" "}
                    <span className="text-indigo-400">cliquez pour choisir</span>
                </span>
                 <span className="text-xs text-slate-500">Document, image ou vidéo pour plus de contexte</span>
            </span>
        ) : (
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <FileIcon className="w-10 h-10 text-indigo-400" />
                <p className="text-slate-300 font-medium break-all">{file.name}</p>
                <button
                    onClick={handleRemoveFile}
                    className="mt-2 text-sm text-red-400 hover:text-red-300"
                >
                    Retirer le fichier
                </button>
            </div>
        )}

        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
