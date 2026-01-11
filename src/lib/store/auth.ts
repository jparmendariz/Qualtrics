import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ResearchManager {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "research_manager" | "admin";
  team?: string;
  joinedAt: string;
  lastLoginAt: string;
  stats: {
    activeProjects: number;
    completedProjects: number;
    totalProjects: number;
  };
}

interface AuthState {
  currentUser: ResearchManager | null;
  users: ResearchManager[];
  isAuthenticated: boolean;

  // Actions
  login: (email: string, name: string) => ResearchManager;
  logout: () => void;
  updateProfile: (updates: Partial<ResearchManager>) => void;
  updateStats: (userId: string, stats: Partial<ResearchManager["stats"]>) => void;
  getUser: (id: string) => ResearchManager | undefined;
  getAllUsers: () => ResearchManager[];
}

// Generate avatar color from name
function getAvatarColor(name: string): string {
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-green-500",
  ];
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isAuthenticated: false,

      login: (email, name) => {
        const existingUser = get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
          // Update last login
          const updatedUser = {
            ...existingUser,
            lastLoginAt: new Date().toISOString(),
          };

          set((state) => ({
            currentUser: updatedUser,
            isAuthenticated: true,
            users: state.users.map((u) => (u.id === existingUser.id ? updatedUser : u)),
          }));

          return updatedUser;
        }

        // Create new user
        const newUser: ResearchManager = {
          id: `rm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email,
          name,
          avatar: getAvatarColor(name),
          role: "research_manager",
          joinedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          stats: {
            activeProjects: 0,
            completedProjects: 0,
            totalProjects: 0,
          },
        };

        set((state) => ({
          currentUser: newUser,
          isAuthenticated: true,
          users: [...state.users, newUser],
        }));

        return newUser;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updates };

        set((state) => ({
          currentUser: updatedUser,
          users: state.users.map((u) => (u.id === currentUser.id ? updatedUser : u)),
        }));
      },

      updateStats: (userId, stats) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, stats: { ...u.stats, ...stats } } : u
          ),
          currentUser:
            state.currentUser?.id === userId
              ? { ...state.currentUser, stats: { ...state.currentUser.stats, ...stats } }
              : state.currentUser,
        }));
      },

      getUser: (id) => {
        return get().users.find((u) => u.id === id);
      },

      getAllUsers: () => {
        return get().users;
      },
    }),
    {
      name: "rx-hub-auth",
    }
  )
);
