import React from 'react';
import Editor from "@monaco-editor/react";

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

const YamlEditor: React.FC<EditorProps> = ({ value, onChange }) => {
    const handleEditorChange = (value: string | undefined) => {
        onChange(value || "");
    };

    return (
        <Editor
            height="100%"
            defaultLanguage="yaml"
            value={value}
            onChange={handleEditorChange}
            options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: 'on',
                padding: { top: 16 }
            }}
        />
    );
};

export default YamlEditor;
