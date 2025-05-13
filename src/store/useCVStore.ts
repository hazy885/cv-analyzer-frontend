import { create } from 'zustand';

// Define CV data structure
export interface CVData {
  name?: string;
  headline?: string;
  location?: string;
  connections?: string;
  linkedin_url?: string;
  email?: string[];
  phone?: string[];
  skills?: string[];
  experience?: string[];
  education?: string[];
  certifications?: string[];
  languages?: string[];
  volunteering?: string[];
  recommendations?: string[];
  source?: string;
  raw_text?: string;
  parsed_date?: string;
}

// Define parsed CV response structure
export interface ParsedCV {
  source: string;
  profile_url?: string;
  cv_data: CVData;
  error?: string;
}

interface CVStore {
  // Files
  uploadedCVs: File[];
  setUploadedCVs: (files: File[]) => void;
  
  // Parsed CV data
  parsedCVs: ParsedCV[];
  addParsedCV: (cv: ParsedCV) => void;
  updateParsedCV: (index: number, cv: ParsedCV) => void;
  removeParsedCV: (index: number) => void;
  clearParsedCVs: () => void;
  
  // Current CV being viewed/edited
  currentCVIndex: number | null;
  setCurrentCVIndex: (index: number | null) => void;
  
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useCVStore = create<CVStore>((set) => ({
  // Files
  uploadedCVs: [],
  setUploadedCVs: (files) => set({ uploadedCVs: files }),
  
  // Parsed CV data
  parsedCVs: [],
  addParsedCV: (cv) => set((state) => ({ 
    parsedCVs: [...state.parsedCVs, cv] 
  })),
  updateParsedCV: (index, cv) => set((state) => {
    const updatedCVs = [...state.parsedCVs];
    updatedCVs[index] = cv;
    return { parsedCVs: updatedCVs };
  }),
  removeParsedCV: (index) => set((state) => ({
    parsedCVs: state.parsedCVs.filter((_, i) => i !== index)
  })),
  clearParsedCVs: () => set({ parsedCVs: [] }),
  
  // Current CV being viewed/edited
  currentCVIndex: null,
  setCurrentCVIndex: (index) => set({ currentCVIndex: index }),
  
  // Loading state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));