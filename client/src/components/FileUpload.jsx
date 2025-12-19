import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';

const FileUpload = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Basic validation
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
            setSelectedFile(file);
            onFileSelect(file);
        } else {
            alert('Please upload an Excel file (.xlsx)');
        }
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        onFileSelect(null);
    }

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <div
                className={`relative group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ${isDragging
                        ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
                        : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                    } ${selectedFile ? 'bg-indigo-50/20 border-indigo-200' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center cursor-pointer">
                    {selectedFile ? (
                        <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                            <div className="p-4 bg-green-100 rounded-full mb-3 text-green-600">
                                <FileSpreadsheet size={40} />
                            </div>
                            <p className="mb-2 text-lg font-semibold text-slate-700">
                                {selectedFile.name}
                            </p>
                            <p className="text-sm text-slate-500">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                            <button
                                onClick={clearFile}
                                className="mt-4 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-full text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <X size={16} /> Remove File
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50'}`}>
                                <Upload size={32} />
                            </div>
                            <p className="mb-2 text-lg text-slate-700 font-medium">
                                <span className="font-bold text-indigo-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-sm text-slate-500">
                                Excel files only (XLSX)
                            </p>
                        </>
                    )}
                </div>
                {!selectedFile && (
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                        accept=".xlsx"
                    />
                )}
            </div>
        </div>
    );
};

export default FileUpload;
