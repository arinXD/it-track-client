import { create } from "zustand";

export const useToggleSideBarStore = create((set) => ({
     toggle: true,
     setToggle: () => set((state) => ({ toggle: !state.toggle }))
}))