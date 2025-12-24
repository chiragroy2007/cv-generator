import React from 'react';
import { Loader2 } from 'lucide-react';

interface PreviewProps {
    pdfUrl: string | null;
    htmlUrl: string | null;
    isLoading: boolean;
    mode: 'pdf' | 'html';
}

const Preview: React.FC<PreviewProps> = ({ pdfUrl, htmlUrl, isLoading, mode }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-gray-500 gap-3 h-full">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-sm font-medium">Generating your CV...</p>
            </div>
        );
    }

    const url = mode === 'pdf' ? pdfUrl : htmlUrl;

    if (!url) {
        return (
            <div className="flex flex-col items-center justify-center text-gray-400 gap-3 h-full border-2 border-dashed border-gray-300 rounded-lg mx-8 my-8">
                <p>No {mode.toUpperCase()} generated yet</p>
                <p className="text-xs">Click "Render CV" to preview</p>
            </div>
        );
    }

    return (
        <object
            data={url}
            type={mode === 'pdf' ? "application/pdf" : "text/html"}
            className="w-full h-full rounded-lg shadow-lg border border-gray-200 bg-white"
            title="CV Preview"
        >
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Unable to display {mode.toUpperCase()}.</p>
                <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    Download {mode.toUpperCase()}
                </a>
            </div>
        </object>
    );
};

export default Preview;
