export interface SocialNetwork {
    network: string;
    username: string;
}

export interface Header {
    name: string;
    headline?: string;
    location?: string;
    email?: string;
    phone?: string;
    website?: string;
    social_networks?: SocialNetwork[];
    photo?: string;
    custom_connections?: Array<{ [key: string]: string }>;
}

export interface EducationEntry {
    institution: string;
    area: string;
    degree: string;
    start_date: string;
    end_date: string;
    location?: string;
    date?: string;
    summary?: string;
    highlights?: string[];
}

export interface ExperienceEntry {
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    location?: string;
    date?: string;
    summary?: string;
    highlights?: string[];
}

export interface ProjectEntry {
    name: string;
    start_date?: string;
    end_date?: string;
    date?: string;
    location?: string;
    summary?: string;
    highlights?: string[];
}

export interface PublicationEntry {
    title: string;
    authors: string[];
    doi?: string;
    url?: string;
    journal: string;
    date: string;
    summary?: string;
}

export interface SkillEntry {
    label: string;
    details: string;
}

export interface BulletEntry {
    bullet: string;
}

export interface PatentEntry {
    number: string;
}

export interface InvitedTalkEntry {
    reversed_number: string;
}

export interface GenericEntry {
    [key: string]: any;
}

export interface CVData {
    cv: {
        name: string;
        headline?: string;
        location?: string;
        email?: string;
        phone?: string;
        website?: string;
        social_networks?: SocialNetwork[];
        photo?: string;
        custom_connections?: any;
        sections?: {
            education?: EducationEntry[];
            experience?: ExperienceEntry[];
            projects?: ProjectEntry[];
            publications?: PublicationEntry[];
            skills?: SkillEntry[];
            selected_honors?: BulletEntry[];
            patents?: PatentEntry[];
            invited_talks?: InvitedTalkEntry[];
            "Welcome to TeamNeuron"?: string[]; // Text entries are strings
            any_section_title?: string[];
            [key: string]: any; // Allow other section types
        };
    };
    design?: {
        theme: string;
        [key: string]: any; // Allow full design control
    };
    locale?: {
        [key: string]: any;
    };
    settings?: {
        [key: string]: any;
    };
}
