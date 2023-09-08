import { create } from 'zustand';

interface useStoreModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onCLose: () => void;
}

export const useStoreModal = create<useStoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onCLose: () => set({ isOpen: false }),
}));
