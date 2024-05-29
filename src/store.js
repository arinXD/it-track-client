import { create } from "zustand";

export const useToggleSideBarStore = create((set) => ({
     toggle: false,
     setToggle: () => set((state) => ({ toggle: !state.toggle }))
}))