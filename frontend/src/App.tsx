import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import FormEditor from './components/FormEditor';
import Preview from './components/Preview';
import Sidebar from './components/Sidebar';
import { FileText, Download, Code, List, Loader2 } from 'lucide-react';
import yaml from 'js-yaml';
import type { CVData } from './types';

const INITIAL_DATA: CVData = {
  cv: {
    name: "John Doe",
    headline: "",
    location: "San Francisco, CA",
    email: "john.doe@email.com",
    photo: "",
    phone: "",
    website: "https://teamneuron.blog/",
    social_networks: [
      { network: "LinkedIn", username: "TeamNeuron" },
      { network: "GitHub", username: "chiragroy2007" }
    ],
    custom_connections: [],
    sections: {
      "Welcome to TeamNeuron": [
        "TeamNeuron reads a CV written in a YAML file, and generates a PDF with professional typography.",
        "See the [documentation](https://teamneuron.blog) for more details."
      ],
      education: [
        {
          institution: "Princeton University",
          area: "Computer Science",
          degree: "PhD",
          date: "",
          start_date: "2018-09",
          end_date: "2023-05",
          location: "Princeton, NJ",
          summary: "",
          highlights: [
            "Thesis: Efficient Neural Architecture Search for Resource-Constrained Deployment",
            "Advisor: Prof. Sanjeev Arora",
            "NSF Graduate Research Fellowship, Siebel Scholar (Class of 2022)"
          ]
        },
        {
          institution: "Boğaziçi University",
          area: "Computer Engineering",
          degree: "BS",
          date: "",
          start_date: "2014-09",
          end_date: "2018-06",
          location: "Istanbul, Türkiye",
          summary: "",
          highlights: [
            "GPA: 3.97/4.00, Valedictorian",
            "Fulbright Scholarship recipient for graduate studies"
          ]
        }
      ],
      experience: [
        {
          company: "Nexus AI",
          position: "Co-Founder & CTO",
          date: "",
          start_date: "2023-06",
          end_date: "present",
          location: "San Francisco, CA",
          summary: "",
          highlights: [
            "Built foundation model infrastructure serving 2M+ monthly API requests with 99.97% uptime",
            "Raised $18M Series A led by Sequoia Capital, with participation from a16z and Founders Fund",
            "Scaled engineering team from 3 to 28 across ML research, platform, and applied AI divisions",
            "Developed proprietary inference optimization reducing latency by 73% compared to baseline"
          ]
        },
        {
          company: "NVIDIA Research",
          position: "Research Intern",
          date: "",
          start_date: "2022-05",
          end_date: "2022-08",
          location: "Santa Clara, CA",
          summary: "",
          highlights: [
            "Designed sparse attention mechanism reducing transformer memory footprint by 4.2x",
            "Co-authored paper accepted at NeurIPS 2022 (spotlight presentation, top 5% of submissions)"
          ]
        },
        {
          company: "Google DeepMind",
          position: "Research Intern",
          date: "",
          start_date: "2021-05",
          end_date: "2021-08",
          location: "London, UK",
          summary: "",
          highlights: [
            "Developed reinforcement learning algorithms for multi-agent coordination",
            "Published research at top-tier venues with significant academic impact",
            "  - ICML 2022 main conference paper, cited 340+ times within two years",
            "  - NeurIPS 2022 workshop paper on emergent communication protocols",
            "  - Invited journal extension in JMLR (2023)"
          ]
        },
        {
          company: "Apple ML Research",
          position: "Research Intern",
          date: "",
          start_date: "2020-05",
          end_date: "2020-08",
          location: "Cupertino, CA",
          summary: "",
          highlights: [
            "Created on-device neural network compression pipeline deployed across 50M+ devices",
            "Filed 2 patents on efficient model quantization techniques for edge inference"
          ]
        },
        {
          company: "Microsoft Research",
          position: "Research Intern",
          date: "",
          start_date: "2019-05",
          end_date: "2019-08",
          location: "Redmond, WA",
          summary: "",
          highlights: [
            "Implemented novel self-supervised learning framework for low-resource language modeling",
            "Research integrated into Azure Cognitive Services, reducing training data requirements by 60%"
          ]
        }
      ],
      projects: [
        {
          name: "[FlashInfer](https://github.com/)",
          start_date: "2023-01",
          end_date: "present",
          summary: "Open-source library for high-performance LLM inference kernels",
          highlights: [
            "Achieved 2.8x speedup over baseline attention implementations on A100 GPUs",
            "Adopted by 3 major AI labs, 8,500+ GitHub stars, 200+ contributors"
          ]
        },
        {
          name: "[NeuralPrune](https://github.com/)",
          date: "2021",
          start_date: "",
          end_date: "",
          summary: "Automated neural network pruning toolkit with differentiable masks",
          highlights: [
            "Reduced model size by 90% with less than 1% accuracy degradation on ImageNet",
            "Featured in PyTorch ecosystem tools, 4,200+ GitHub stars"
          ]
        }
      ],
      publications: [
        {
          title: "Sparse Mixture-of-Experts at Scale: Efficient Routing for Trillion-Parameter Models",
          authors: [
            "*John Doe*",
            "Sarah Williams",
            "David Park"
          ],
          summary: "",
          doi: "10.1234/neurips.2023.1234",
          url: "",
          journal: "NeurIPS 2023",
          date: "2023-07"
        },
        {
          title: "Neural Architecture Search via Differentiable Pruning",
          authors: [
            "James Liu",
            "*John Doe*"
          ],
          summary: "",
          doi: "10.1234/neurips.2022.5678",
          url: "",
          journal: "NeurIPS 2022, Spotlight",
          date: "2022-12"
        },
        {
          title: "Multi-Agent Reinforcement Learning with Emergent Communication",
          authors: [
            "Maria Garcia",
            "*John Doe*",
            "Tom Anderson"
          ],
          summary: "",
          doi: "10.1234/icml.2022.9012",
          url: "",
          journal: "ICML 2022",
          date: "2022-07"
        },
        {
          title: "On-Device Model Compression via Learned Quantization",
          authors: [
            "*John Doe*",
            "Kevin Wu"
          ],
          summary: "",
          doi: "10.1234/iclr.2021.3456",
          url: "",
          journal: "ICLR 2021, Best Paper Award",
          date: "2021-05"
        }
      ],
      selected_honors: [
        { bullet: "MIT Technology Review 35 Under 35 Innovators (2024)" },
        { bullet: "Forbes 30 Under 30 in Enterprise Technology (2024)" },
        { bullet: "ACM Doctoral Dissertation Award Honorable Mention (2023)" },
        { bullet: "Google PhD Fellowship in Machine Learning (2020 – 2023)" },
        { bullet: "Fulbright Scholarship for Graduate Studies (2018)" }
      ],
      skills: [
        { label: "Languages", details: "Python, C++, CUDA, Rust, Julia" },
        { label: "ML Frameworks", details: "PyTorch, JAX, TensorFlow, Triton, ONNX" },
        { label: "Infrastructure", details: "Kubernetes, Ray, distributed training, AWS, GCP" },
        { label: "Research Areas", details: "Neural architecture search, model compression, efficient inference, multi-agent RL" }
      ],
      patents: [
        { number: "Adaptive Quantization for Neural Network Inference on Edge Devices (US Patent 11,234,567)" },
        { number: "Dynamic Sparsity Patterns for Efficient Transformer Attention (US Patent 11,345,678)" },
        { number: "Hardware-Aware Neural Architecture Search Method (US Patent 11,456,789)" }
      ],
      invited_talks: [
        { reversed_number: "Scaling Laws for Efficient Inference — Stanford HAI Symposium (2024)" },
        { reversed_number: "Building AI Infrastructure for the Next Decade — TechCrunch Disrupt (2024)" },
        { reversed_number: "'From Research to Production: Lessons in ML Systems — NeurIPS Workshop (2023)'" },
        { reversed_number: "\"Efficient Deep Learning: A Practitioner's Perspective — Google Tech Talk (2022)\"" }
      ],
      any_section_title: [
        "You can use any section title you want.",
        "You can choose any entry type for the section: `TextEntry`, `ExperienceEntry`, `EducationEntry`, `PublicationEntry`, `BulletEntry`, `NumberedEntry`, or `ReversedNumberedEntry`.",
        "Markdown syntax is supported everywhere.",
        "The `design` field in YAML gives you control over almost any aspect of your CV design.",
        "See the [documentation](https://docs.rendercv.com) for more details."
      ]
    }
  },
  design: {
    theme: "classic"
  },
  locale: {
    language: "english"
  },
  settings: {
    current_date: "2025-12-24",
    render_command: {
      design: null,
      locale: null,
      typst_path: "rendercv_output\\NAME_IN_SNAKE_CASE_CV.typ",
      pdf_path: "rendercv_output\\NAME_IN_SNAKE_CASE_CV.pdf",
      markdown_path: "rendercv_output\\NAME_IN_SNAKE_CASE_CV.md",
      html_path: "rendercv_output\\NAME_IN_SNAKE_CASE_CV.html",
      png_path: "rendercv_output\\NAME_IN_SNAKE_CASE_CV.png",
      dont_generate_markdown: false,
      dont_generate_html: false,
      dont_generate_typst: false,
      dont_generate_pdf: false,
      dont_generate_png: false
    },
    bold_keywords: []
  }
};



const EMPTY_DATA: CVData = {
  cv: {
    name: "Your Name",
    headline: "",
    location: "",
    email: "",
    phone: "",
    website: "",
    social_networks: [],
    custom_connections: [],
    sections: {
      "Welcome to TeamNeuron": [],
      education: [],
      experience: [],
      projects: [],
      publications: [],
      skills: [],
      selected_honors: [],
      patents: [],
      invited_talks: [],
      any_section_title: []
    }
  },
  design: {
    theme: "classic"
  },
  settings: {
    render_command: {
      design: null,
      locale: null,
      typst_path: "rendercv_output\\NAME_IN_SNAKE_CASE_CV.typ",
      pdf_path: "rendercv_output\\NAME_IN_SNAKE_CASE_CV.pdf",
      markdown_path: "rendercv_output\\NAME_IN_SNAKE_CASE_CV.md",
      html_path: "rendercv_output\\NAME_IN_SNAKE_CASE_CV.html",
      png_path: "rendercv_output\\NAME_IN_SNAKE_CASE_CV.png",
      dont_generate_markdown: false,
      dont_generate_html: false,
      dont_generate_typst: false,
      dont_generate_pdf: false,
      dont_generate_png: false
    }
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'yaml'>('form');
  const [activePreview, setActivePreview] = useState<'pdf' | 'html'>('pdf'); // Toggle state
  const [yamlContent, setYamlContent] = useState<string>("");
  const [formData, setFormData] = useState<CVData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [htmlUrl, setHtmlUrl] = useState<string | null>(null); // New state
  const [formVersion, setFormVersion] = useState(0);
  const [lastRenderedYaml, setLastRenderedYaml] = useState<string>("");
  const [hasInitialRender, setHasInitialRender] = useState(false);

  // Initialize YAML from data
  useEffect(() => {
    try {
      const cleaned = cleanData(INITIAL_DATA);
      const y = yaml.dump(cleaned);
      setYamlContent(y);
    } catch (e) { console.error(e); }
  }, []);

  // Auto-render on initial load once YAML is ready
  useEffect(() => {
    if (yamlContent && !hasInitialRender) {
      handleGenerate();
      setHasInitialRender(true);
    }
  }, [yamlContent]); // Only depend on yamlContent (and internal hasInitialRender)

  // Helper to remove empty keys specifically for RenderCV schema compliance
  const cleanData = (data: CVData): CVData => {
    const clean = JSON.parse(JSON.stringify(data)); // Deep clone

    // Recursively clean objects
    const sanitize = (obj: any) => {
      if (Array.isArray(obj)) {
        obj.forEach(sanitize);
      } else if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
            delete obj[key];
          } else {
            sanitize(obj[key]);
          }
        });
      }
    };

    sanitize(clean);
    return clean;
  }

  const handleFormUpdate = (newData: CVData) => {
    setFormData(newData);
    try {
      // Clean data before dumping to YAML to remove empty strings which cause validation errors
      const cleaned = cleanData(newData);
      const newYaml = yaml.dump(cleaned);
      setYamlContent(newYaml);
    } catch (e) {
      console.error("YAML conversion failed", e);
    }
  };

  const handleYamlUpdate = (newYaml: string) => {
    setYamlContent(newYaml);
    try {
      // Optional: Try to parse back to form data if valid
      const parsed = yaml.load(newYaml) as CVData;
      if (parsed && parsed.cv) {
        setFormData(parsed);
      }
    } catch (e) {
      // Invalid YAML is fine while typing
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yaml_content: yamlContent }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(`Generation failed: ${err.detail || 'Unknown error'}`);
        return;
      }

      // Handle JSON response
      const data = await response.json();
      if (data.pdf_url) setPdfUrl(data.pdf_url);
      if (data.html_url) setHtmlUrl(data.html_url);

      // Update last rendered state
      setLastRenderedYaml(yamlContent);

    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const isDirty = yamlContent !== lastRenderedYaml;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* ... Sidebar ... */}
      <Sidebar
        onLoadTemplate={(content) => {
          setYamlContent(content);
          try {
            const parsed = yaml.load(content) as CVData;
            if (parsed && parsed.cv) {
              setFormData(parsed);
              setFormVersion(v => v + 1);
            }
          } catch (e) { }
        }}
        onNewFile={() => {
          setYamlContent("");
          setFormData(EMPTY_DATA);
          setFormVersion(v => v + 1);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">TeamNeuron</h1>
              <p className="text-[10px] text-gray-500 -mt-1 uppercase tracking-wider">Tools</p>
            </div>

            <div className="flex bg-gray-100 rounded-lg p-1 ml-6">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${activeTab === 'form' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List size={14} /> Form
              </button>
              <button
                onClick={() => setActiveTab('yaml')}
                className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${activeTab === 'yaml' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Code size={14} /> YAML
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Preview Toggle */}
            <div className="bg-gray-100 p-1 rounded-lg flex items-center text-sm font-medium">
              <button
                onClick={() => setActivePreview('pdf')}
                className={`px-3 py-1.5 rounded-md transition-all ${activePreview === 'pdf' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                PDF
              </button>
              <button
                onClick={() => setActivePreview('html')}
                className={`px-3 py-1.5 rounded-md transition-all ${activePreview === 'html' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                HTML
              </button>
            </div>

            {pdfUrl && (
              <a href={pdfUrl} download className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                <Download size={16} /> PDF
              </a>
            )}
            {htmlUrl && (
              <a href={htmlUrl} download className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                <Download size={16} /> HTML
              </a>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDirty
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <span>{isDirty ? 'Render Update' : 'Render CV'}</span>}
            </button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Pane */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white overflow-hidden">
            {activeTab === 'form' ? (
              <div className="flex-1 overflow-y-auto">
                <FormEditor
                  key={formVersion}
                  initialData={formData}
                  onUpdate={handleFormUpdate}
                />
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                  <span>YAML Source</span>
                </div>
                <Editor value={yamlContent} onChange={handleYamlUpdate} />
              </div>
            )}
          </div>

          {/* Preview Pane */}
          <div className="w-1/2 flex flex-col bg-gray-100">
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between items-center">
              <span>Preview ({activePreview.toUpperCase()})</span>
            </div>
            <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
              <Preview pdfUrl={pdfUrl} htmlUrl={htmlUrl} isLoading={isGenerating} mode={activePreview} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
