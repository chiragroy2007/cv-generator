import React, { useEffect, useState } from 'react';
import { Layout, Plus, FileText } from 'lucide-react';

interface SidebarProps {
    onLoadTemplate: (content: string) => void;
    onNewFile: () => void;
}

interface Template {
    name: string;
    filename: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onLoadTemplate, onNewFile }) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/templates')
            .then(res => res.json())
            .then(data => setTemplates(data))
            .catch(err => console.error("Failed to load templates", err));
    }, []);

    const handleLoad = async (filename: string) => {
        setActiveTemplate(filename);
        try {
            const res = await fetch(`http://localhost:8000/api/templates/${filename}`);
            const data = await res.json();
            onLoadTemplate(data.content);
        } catch (e) {
            console.error("Failed to fetch template content", e);
        }
    };

    const handleNewFile = () => {
        setActiveTemplate(null);
        onNewFile();
    };

    return (
        <div className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0">
            <div className="h-14 border-b border-gray-200 flex items-center px-4 font-bold text-gray-700">
                <Layout className="mr-2" size={18} /> Templates
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {templates.map((theme) => (
                    <div
                        key={theme.filename}
                        onClick={() => handleLoad(theme.filename)}
                        className={`p-3 rounded-md border cursor-pointer transition-all group flex items-center gap-2 ${activeTemplate === theme.filename
                            ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                    >
                        <FileText size={16} className={`transition-colors ${activeTemplate === theme.filename ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                        <div>
                            <div className={`font-medium text-sm ${activeTemplate === theme.filename ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}`}>{theme.name}</div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleNewFile}
                    className={`w-full mt-4 p-3 border border-dashed rounded-md flex items-center justify-center gap-2 transition-colors ${activeTemplate === null ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600'
                        }`}
                >
                    <Plus size={16} /> New Blank File
                </button>
            </div>
            <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
                <p className="mb-1">
                    Created by <a href="https://www.chirag404.me" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Chirag</a>
                </p>
                <p>&copy; 2025 TeamNeuron</p>
            </div>
        </div>
    );
};

export default Sidebar;
