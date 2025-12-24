import React, { useEffect, useState } from 'react';
import type { CVData } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface FormEditorProps {
    initialData: CVData;
    onUpdate: (data: CVData) => void;
}

const FormEditor: React.FC<FormEditorProps> = ({ initialData, onUpdate }) => {
    const [data, setData] = useState<CVData>(initialData);

    useEffect(() => {
        onUpdate(data);
    }, [data, onUpdate]);

    const updateField = (path: string[], value: any) => {
        const newData = { ...data };
        let current: any = newData;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) current[path[i]] = {};
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        setData(newData);
    };

    const addArrayItem = (path: string[], item: any) => {
        const newData = { ...data };
        let current: any = newData;
        for (let i = 0; i < path.length; i++) {
            if (!current[path[i]]) current[path[i]] = [];
            current = current[path[i]];
        }
        if (Array.isArray(current)) {
            current.push(item);
            setData(newData);
        }
    };

    const removeArrayItem = (path: string[], index: number) => {
        const newData = { ...data };
        let current: any = newData;
        for (let i = 0; i < path.length; i++) {
            if (!current[path[i]]) current[path[i]] = [];
            current = current[path[i]];
        }
        if (Array.isArray(current)) {
            current.splice(index, 1);
            setData(newData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, path: string[]) => {
        updateField(path, e.target.value);
    };

    return (
        <div className="p-6 space-y-8 pb-20">
            {/* Welcome / Intro */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Intro / Welcome</h3>
                    <button onClick={() => addArrayItem(['cv', 'sections', 'Welcome to TeamNeuron'], "")} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>
                {data.cv.sections?.['Welcome to TeamNeuron']?.map((text, idx) => (
                    <div key={idx} className="flex gap-4 items-end bg-gray-50 p-3 rounded-md relative group">
                        <div className="flex-1 flex flex-col">
                            <label className="text-xs font-medium text-gray-500 mb-1">Text Line</label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => {
                                    const newLines = [...(data.cv.sections?.['Welcome to TeamNeuron'] || [])];
                                    newLines[idx] = e.target.value;
                                    updateField(['cv', 'sections', 'Welcome to TeamNeuron'], newLines);
                                }}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <button onClick={() => removeArrayItem(['cv', 'sections', 'Welcome to TeamNeuron'], idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                ))}
            </section>
            {/* Header Info */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name" value={data.cv.name} onChange={(e) => handleChange(e, ['cv', 'name'])} />
                    <Input label="Headline" value={data.cv.headline} onChange={(e) => handleChange(e, ['cv', 'headline'])} placeholder="e.g. Software Engineer" />
                    <Input label="Location" value={data.cv.location} onChange={(e) => handleChange(e, ['cv', 'location'])} />
                    <Input label="Email" value={data.cv.email} onChange={(e) => handleChange(e, ['cv', 'email'])} />
                    <Input label="Phone" value={data.cv.phone} onChange={(e) => handleChange(e, ['cv', 'phone'])} />
                    <Input label="Website" value={data.cv.website} onChange={(e) => handleChange(e, ['cv', 'website'])} />
                </div>
            </section>

            {/* Social Networks */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Social Networks</h3>
                    <button onClick={() => addArrayItem(['cv', 'social_networks'], { network: 'LinkedIn', username: '' })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>

                {data.cv.social_networks?.map((net, idx) => (
                    <div key={idx} className="flex gap-4 items-end bg-gray-50 p-3 rounded-md relative group">
                        <Input label="Network" value={net.network} onChange={(e) => {
                            const newNets = [...(data.cv.social_networks || [])];
                            newNets[idx].network = e.target.value;
                            updateField(['cv', 'social_networks'], newNets);
                        }} />
                        <Input label="Username" value={net.username} onChange={(e) => {
                            const newNets = [...(data.cv.social_networks || [])];
                            newNets[idx].username = e.target.value;
                            updateField(['cv', 'social_networks'], newNets);
                        }} />
                        <button onClick={() => removeArrayItem(['cv', 'social_networks'], idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                    <button onClick={() => addArrayItem(['cv', 'sections', 'education'], { institution: '', area: '', degree: 'BS', start_date: '', end_date: '' })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>
                {data.cv.sections?.education?.map((edu, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg space-y-3 relative">
                        <button onClick={() => removeArrayItem(['cv', 'sections', 'education'], idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Institution" value={edu.institution} onChange={(e) => {
                                const newEdu = [...(data.cv.sections?.education || [])];
                                newEdu[idx].institution = e.target.value;
                                updateField(['cv', 'sections', 'education'], newEdu);
                            }} />
                            <Input label="Area/Major" value={edu.area} onChange={(e) => {
                                const newEdu = [...(data.cv.sections?.education || [])];
                                newEdu[idx].area = e.target.value;
                                updateField(['cv', 'sections', 'education'], newEdu);
                            }} />
                            <Input label="Degree" value={edu.degree} onChange={(e) => {
                                const newEdu = [...(data.cv.sections?.education || [])];
                                newEdu[idx].degree = e.target.value;
                                updateField(['cv', 'sections', 'education'], newEdu);
                            }} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="Start Date" value={edu.start_date} placeholder="YYYY-MM" onChange={(e) => {
                                    const newEdu = [...(data.cv.sections?.education || [])];
                                    newEdu[idx].start_date = e.target.value;
                                    updateField(['cv', 'sections', 'education'], newEdu);
                                }} />
                                <Input label="End Date" value={edu.end_date} placeholder="YYYY-MM" onChange={(e) => {
                                    const newEdu = [...(data.cv.sections?.education || [])];
                                    newEdu[idx].end_date = e.target.value;
                                    updateField(['cv', 'sections', 'education'], newEdu);
                                }} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Experience */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
                    <button onClick={() => addArrayItem(['cv', 'sections', 'experience'], { company: '', position: '', start_date: '', end_date: '' })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>
                {data.cv.sections?.experience?.map((exp, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg space-y-3 relative">
                        <button onClick={() => removeArrayItem(['cv', 'sections', 'experience'], idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Company" value={exp.company} onChange={(e) => {
                                const newExp = [...(data.cv.sections?.experience || [])];
                                newExp[idx].company = e.target.value;
                                updateField(['cv', 'sections', 'experience'], newExp);
                            }} />
                            <Input label="Position" value={exp.position} onChange={(e) => {
                                const newExp = [...(data.cv.sections?.experience || [])];
                                newExp[idx].position = e.target.value;
                                updateField(['cv', 'sections', 'experience'], newExp);
                            }} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="Start Date" value={exp.start_date} placeholder="YYYY-MM" onChange={(e) => {
                                    const newExp = [...(data.cv.sections?.experience || [])];
                                    newExp[idx].start_date = e.target.value;
                                    updateField(['cv', 'sections', 'experience'], newExp);
                                }} />
                                <Input label="End Date" value={exp.end_date} placeholder="YYYY-MM" onChange={(e) => {
                                    const newExp = [...(data.cv.sections?.experience || [])];
                                    newExp[idx].end_date = e.target.value;
                                    updateField(['cv', 'sections', 'experience'], newExp);
                                }} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Projects */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                    <button onClick={() => addArrayItem(['cv', 'sections', 'projects'], { name: '', start_date: '', end_date: '', summary: '' })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>
                {data.cv.sections?.projects?.map((proj, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg space-y-3 relative">
                        <button onClick={() => removeArrayItem(['cv', 'sections', 'projects'], idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Project Name" value={proj.name} onChange={(e) => {
                                const newProj = [...(data.cv.sections?.projects || [])];
                                newProj[idx].name = e.target.value;
                                updateField(['cv', 'sections', 'projects'], newProj);
                            }} />
                            <Input label="Summary" value={proj.summary} onChange={(e) => {
                                const newProj = [...(data.cv.sections?.projects || [])];
                                newProj[idx].summary = e.target.value;
                                updateField(['cv', 'sections', 'projects'], newProj);
                            }} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="Start Date" value={proj.start_date} placeholder="YYYY-MM" onChange={(e) => {
                                    const newProj = [...(data.cv.sections?.projects || [])];
                                    newProj[idx].start_date = e.target.value;
                                    updateField(['cv', 'sections', 'projects'], newProj);
                                }} />
                                <Input label="End Date" value={proj.end_date} placeholder="YYYY-MM" onChange={(e) => {
                                    const newProj = [...(data.cv.sections?.projects || [])];
                                    newProj[idx].end_date = e.target.value;
                                    updateField(['cv', 'sections', 'projects'], newProj);
                                }} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Skills */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                    <button onClick={() => addArrayItem(['cv', 'sections', 'skills'], { label: '', details: '' })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>
                {data.cv.sections?.skills?.map((skill, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg space-y-3 relative">
                        <button onClick={() => removeArrayItem(['cv', 'sections', 'skills'], idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        <div className="grid grid-cols-1 gap-3">
                            <Input label="Category (Label)" value={skill.label} placeholder="e.g. Languages" onChange={(e) => {
                                const newSkills = [...(data.cv.sections?.skills || [])];
                                newSkills[idx].label = e.target.value;
                                updateField(['cv', 'sections', 'skills'], newSkills);
                            }} />
                            <Input label="Details" value={skill.details} placeholder="e.g. Python, C++, Rust" onChange={(e) => {
                                const newSkills = [...(data.cv.sections?.skills || [])];
                                newSkills[idx].details = e.target.value;
                                updateField(['cv', 'sections', 'skills'], newSkills);
                            }} />
                        </div>
                    </div>
                ))}
            </section>

            {/* Publications */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Publications</h3>
                    <button onClick={() => addArrayItem(['cv', 'sections', 'publications'], { title: '', authors: [], journal: '', date: '' })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>
                {data.cv.sections?.publications?.map((pub, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg space-y-3 relative">
                        <button onClick={() => removeArrayItem(['cv', 'sections', 'publications'], idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        <div className="grid grid-cols-1 gap-3">
                            <Input label="Title" value={pub.title} onChange={(e) => {
                                const newPubs = [...(data.cv.sections?.publications || [])];
                                newPubs[idx].title = e.target.value;
                                updateField(['cv', 'sections', 'publications'], newPubs);
                            }} />
                            <Input label="Journal/Conference" value={pub.journal} onChange={(e) => {
                                const newPubs = [...(data.cv.sections?.publications || [])];
                                newPubs[idx].journal = e.target.value;
                                updateField(['cv', 'sections', 'publications'], newPubs);
                            }} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="Date" value={pub.date} placeholder="YYYY-MM" onChange={(e) => {
                                    const newPubs = [...(data.cv.sections?.publications || [])];
                                    newPubs[idx].date = e.target.value;
                                    updateField(['cv', 'sections', 'publications'], newPubs);
                                }} />
                                <Input label="DOI" value={pub.doi} placeholder="10.1234/..." onChange={(e) => {
                                    const newPubs = [...(data.cv.sections?.publications || [])];
                                    newPubs[idx].doi = e.target.value;
                                    updateField(['cv', 'sections', 'publications'], newPubs);
                                }} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Selected Honors */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Selected Honors</h3>
                    <button onClick={() => addArrayItem(['cv', 'sections', 'selected_honors'], { bullet: '' })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>
                {data.cv.sections?.selected_honors?.map((honor, idx) => (
                    <div key={idx} className="flex gap-4 items-end bg-gray-50 p-3 rounded-md relative group">
                        <Input label="Honor" value={honor.bullet} onChange={(e) => {
                            const newHonors = [...(data.cv.sections?.selected_honors || [])];
                            newHonors[idx].bullet = e.target.value;
                            updateField(['cv', 'sections', 'selected_honors'], newHonors);
                        }} />
                        <button onClick={() => removeArrayItem(['cv', 'sections', 'selected_honors'], idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                ))}
            </section>

            {/* Patents */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Patents</h3>
                    <button onClick={() => addArrayItem(['cv', 'sections', 'patents'], { number: '' })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>
                {data.cv.sections?.patents?.map((patent, idx) => (
                    <div key={idx} className="flex gap-4 items-end bg-gray-50 p-3 rounded-md relative group">
                        <Input label="Patent Info" value={patent.number} onChange={(e) => {
                            const newPatents = [...(data.cv.sections?.patents || [])];
                            newPatents[idx].number = e.target.value;
                            updateField(['cv', 'sections', 'patents'], newPatents);
                        }} />
                        <button onClick={() => removeArrayItem(['cv', 'sections', 'patents'], idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                ))}
            </section>

            {/* Invited Talks */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Invited Talks</h3>
                    <button onClick={() => addArrayItem(['cv', 'sections', 'invited_talks'], { reversed_number: '' })} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>
                {data.cv.sections?.invited_talks?.map((talk, idx) => (
                    <div key={idx} className="flex gap-4 items-end bg-gray-50 p-3 rounded-md relative group">
                        <Input label="Talk Details" value={talk.reversed_number} onChange={(e) => {
                            const newTalks = [...(data.cv.sections?.invited_talks || [])];
                            newTalks[idx].reversed_number = e.target.value;
                            updateField(['cv', 'sections', 'invited_talks'], newTalks);
                        }} />
                        <button onClick={() => removeArrayItem(['cv', 'sections', 'invited_talks'], idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                ))}
            </section>


            {/* Custom Section (Example) */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Custom Section (Example)</h3>
                    <button onClick={() => addArrayItem(['cv', 'sections', 'any_section_title'], "")} className="text-blue-600 text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button>
                </div>
                {data.cv.sections?.any_section_title?.map((text, idx) => (
                    <div key={idx} className="flex gap-4 items-end bg-gray-50 p-3 rounded-md relative group">
                        <div className="flex-1 flex flex-col">
                            <label className="text-xs font-medium text-gray-500 mb-1">Text Line</label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => {
                                    const newLines = [...(data.cv.sections?.any_section_title || [])];
                                    newLines[idx] = e.target.value;
                                    updateField(['cv', 'sections', 'any_section_title'], newLines);
                                }}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <button onClick={() => removeArrayItem(['cv', 'sections', 'any_section_title'], idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                ))}
            </section>
        </div >
    );
};

const Input = ({ label, value, onChange, placeholder }: { label: string, value: string | undefined, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
    <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-500 mb-1">{label}</label>
        <input
            type="text"
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
    </div>
);

export default FormEditor;
