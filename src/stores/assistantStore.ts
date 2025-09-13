/**
 * AI助手狀態管理
 * 管理助手列表、當前選擇的助手、對話會話等狀態
 */

import { create } from 'zustand'
import { AIAssistant, SimulationSession, PersonalityProfile } from '../types/assistant'

interface AssistantStore {
  // 助手相關狀態
  assistants: AIAssistant[]
  selectedAssistant: AIAssistant | null

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
  setAssistants: (assistants: AIAssistant[]) => void
  setSelectedAssistant: (assistant: AIAssistant | null) => void
  setCurrentProfile: (profile: PersonalityProfile | null) => void
  setCurrentSession: (session: SimulationSession | null) => void
  addSessionToHistory: (session: SimulationSession) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // 助手操作
  addAssistant: (assistant: AIAssistant) => void
  updateAssistant: (id: string, updates: Partial<AIAssistant>) => void
  removeAssistant: (id: string) => void

  // 個性檔案操作
  addPersonalityProfile: (profile: PersonalityProfile) => void
  updatePersonalityProfile: (id: string, updates: Partial<PersonalityProfile>) => void
  removePersonalityProfile: (id: string) => void

  // 重置狀態
  reset: () => void
}

export const useAssistantStore = create<AssistantStore>((set, get) => ({
  // 初始狀態
  assistants: [],
  selectedAssistant: null,
  personalityProfiles: [],
  currentProfile: null,
  currentSession: null,
  sessionHistory: [],
  isLoading: false,
  error: null,

  // 基本設置操作
  setAssistants: (assistants) => set({ assistants }),
  setSelectedAssistant: (assistant) => set({ selectedAssistant: assistant }),
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  setCurrentSession: (session) => set({ currentSession: session }),
  addSessionToHistory: (session) =>
    set(state => ({
      sessionHistory: [session, ...state.sessionHistory]
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // 助手操作
  addAssistant: (assistant) =>
    set(state => ({
      assistants: [...state.assistants, assistant]
    })),

  updateAssistant: (id, updates) =>
    set(state => ({
      assistants: state.assistants.map(assistant =>
        assistant.id === id ? { ...assistant, ...updates } : assistant
      )
    })),

  removeAssistant: (id) =>
    set(state => ({
      assistants: state.assistants.filter(assistant => assistant.id !== id),
      selectedAssistant: state.selectedAssistant?.id === id ? null : state.selectedAssistant
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
    assistants: [],
    selectedAssistant: null,
    personalityProfiles: [],
    currentProfile: null,
    currentSession: null,
    sessionHistory: [],
    isLoading: false,
    error: null
  })
}))

// 選擇器輔助函數
export const selectAssistantById = (id: string) => (state: AssistantStore) =>
  state.assistants.find(assistant => assistant.id === id)

export const selectProfileById = (id: string) => (state: AssistantStore) =>
  state.personalityProfiles.find(profile => profile.id === id)

export const selectSessionsByAssistant = (assistantId: string) => (state: AssistantStore) =>
  state.sessionHistory.filter(session => session.assistant_id === assistantId)