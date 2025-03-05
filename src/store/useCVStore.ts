import { create } from 'zustand';

interface CVStore {
  uploadedCVs: File[];
  setUploadedCVs: (files: File[]) => void;
}

export const useCVStore = create<CVStore>((set) => ({
  uploadedCVs: [],
  setUploadedCVs: (files) => set({ uploadedCVs: files }),
}));