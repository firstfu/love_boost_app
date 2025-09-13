/**
 * AI分身狀態管理
 * 管理AI分身列表、當前選擇的分身、對話會話等狀態
 */

import { create } from 'zustand'
import { AICompanion, SimulationSession, PersonalityProfile } from '../types/assistant'

interface CompanionStore {
  // AI分身相關狀態
  companions: AICompanion[]
  selectedCompanion: AICompanion | null

  // 個性檔案
  personalityProfiles: PersonalityProfile[]
  currentProfile: PersonalityProfile | null

  // 對話會話
  currentSession: SimulationSession | null
  sessionHistory: SimulationSession[]

  // UI 狀態
  isLoading: boolean
  error: string | null

  // Actions
  setCompanions: (companions: AICompanion[]) => void
  setSelectedCompanion: (companion: AICompanion | null) => void
  setCurrentProfile: (profile: PersonalityProfile | null) => void
  setCurrentSession: (session: SimulationSession | null) => void
  addSessionToHistory: (session: SimulationSession) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // AI分身操作
  addCompanion: (companion: AICompanion) => void
  updateCompanion: (id: string, updates: Partial<AICompanion>) => void
  removeCompanion: (id: string) => void

  // 個性檔案操作
  addPersonalityProfile: (profile: PersonalityProfile) => void
  updatePersonalityProfile: (id: string, updates: Partial<PersonalityProfile>) => void
  removePersonalityProfile: (id: string) => void

  // 重置狀態
  reset: () => void
}

export const useCompanionStore = create<CompanionStore>((set, get) => ({
  // 初始狀態
  companions: [],
  selectedCompanion: null,
  personalityProfiles: [],
  currentProfile: null,
  currentSession: null,
  sessionHistory: [],
  isLoading: false,
  error: null,

  // 基本設置操作
  setCompanions: (companions) => set({ companions }),
  setSelectedCompanion: (companion) => set({ selectedCompanion: companion }),
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  setCurrentSession: (session) => set({ currentSession: session }),
  addSessionToHistory: (session) =>
    set(state => ({
      sessionHistory: [session, ...state.sessionHistory]
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // AI分身操作
  addCompanion: (companion) =>
    set(state => ({
      companions: [...state.companions, companion]
    })),

  updateCompanion: (id, updates) =>
    set(state => ({
      companions: state.companions.map(companion =>
        companion.id === id ? { ...companion, ...updates } : companion
      )
    })),

  removeCompanion: (id) =>
    set(state => ({
      companions: state.companions.filter(companion => companion.id !== id),
      selectedCompanion: state.selectedCompanion?.id === id ? null : state.selectedCompanion
    })),

  // 個性檔案操作
  addPersonalityProfile: (profile) =>
    set(state => ({
      personalityProfiles: [...state.personalityProfiles, profile]
    })),

  updatePersonalityProfile: (id, updates) =>
    set(state => ({
      personalityProfiles: state.personalityProfiles.map(profile =>
        profile.id === id ? { ...profile, ...updates } : profile
      )
    })),

  removePersonalityProfile: (id) =>
    set(state => ({
      personalityProfiles: state.personalityProfiles.filter(profile => profile.id !== id),
      currentProfile: state.currentProfile?.id === id ? null : state.currentProfile
    })),

  // 重置所有狀態
  reset: () => set({
    companions: [],
    selectedCompanion: null,
    personalityProfiles: [],
    currentProfile: null,
    currentSession: null,
    sessionHistory: [],
    isLoading: false,
    error: null
  })
}))

// 選擇器輔助函數
export const selectCompanionById = (id: string) => (state: CompanionStore) =>
  state.companions.find(companion => companion.id === id)

export const selectProfileById = (id: string) => (state: CompanionStore) =>
  state.personalityProfiles.find(profile => profile.id === id)

export const selectSessionsByCompanion = (companionId: string) => (state: CompanionStore) =>
  state.sessionHistory.filter(session => session.companion_id === companionId)

// 向後兼容的導出（暫時保留）
export const useAssistantStore = useCompanionStore