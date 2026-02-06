import { create } from 'zustand';
import { createScenario } from '../api/scenarios.js';
import { getTimeline, getNodeDetail, executeFork as apiFork, getSuggestions } from '../api/timeline.js';
import { getNarration } from '../api/narration.js';
import { parseVoice } from '../api/voice.js';

const useStore = create((set, get) => ({
  // Session
  sessionId: null,
  scenarioMeta: null,
  loading: false,
  error: null,

  // Timeline
  timeline: [],
  branches: [],
  activeBranchId: 'main',
  selectedNodeId: null,

  // Node detail
  selectedNode: null,
  selectedNodeForks: [],
  renderPack: null,

  // Suggestions
  suggestions: [],
  suggestionsLoading: false,

  // Fork
  forkLoading: false,
  forkResult: null,

  // Narration
  narrationText: null,
  narrationLoading: false,

  // Config
  config: { timeHorizon: 'Past', length: '20 min', detail: 'Standard' },

  setConfig: (key, value) => set((s) => ({ config: { ...s.config, [key]: value } })),

  initScenario: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await createScenario(params);
      const firstNodeId = data.timeline?.[0]?.id ?? null;
      set({
        sessionId: data.sessionId,
        scenarioMeta: data.scenario,
        timeline: data.timeline || [],
        branches: data.branches || [],
        activeBranchId: 'main',
        selectedNodeId: firstNodeId,
        loading: false,
      });
      if (firstNodeId) {
        get().loadNodeDetail(firstNodeId);
      }
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  loadNodeDetail: async (nodeId) => {
    const { sessionId } = get();
    if (!sessionId) return;
    try {
      const data = await getNodeDetail(sessionId, nodeId);
      set({
        selectedNode: data.node,
        selectedNodeForks: data.forks || [],
        renderPack: data.renderPack,
      });
    } catch (err) {
      set({ error: err.message });
    }
  },

  selectNode: async (nodeId) => {
    set({ selectedNodeId: nodeId, narrationText: null, suggestions: [] });
    get().loadNodeDetail(nodeId);
  },

  executeFork: async (nodeId, description) => {
    const { sessionId } = get();
    if (!sessionId) return;
    set({ forkLoading: true, error: null });
    try {
      const result = await apiFork(sessionId, nodeId, description);
      // Reload timeline for new branch
      const timelineData = await getTimeline(sessionId, result.branchId);
      set({
        forkLoading: false,
        forkResult: result,
        activeBranchId: result.branchId,
        timeline: timelineData.timeline || [],
        branches: timelineData.branches || [],
        selectedNodeId: result.forkNode?.id ?? null,
      });
      if (result.forkNode?.id) {
        get().loadNodeDetail(result.forkNode.id);
      }
    } catch (err) {
      set({ forkLoading: false, error: err.message });
    }
  },

  switchBranch: async (branchId) => {
    const { sessionId } = get();
    if (!sessionId) return;
    try {
      const data = await getTimeline(sessionId, branchId);
      const timeline = data.timeline || [];
      const lastNodeId = timeline[timeline.length - 1]?.id ?? null;
      set({
        activeBranchId: branchId,
        timeline,
        branches: data.branches || [],
        selectedNodeId: lastNodeId,
        narrationText: null,
        suggestions: [],
      });
      if (lastNodeId) {
        get().loadNodeDetail(lastNodeId);
      }
    } catch (err) {
      set({ error: err.message });
    }
  },

  loadSuggestions: async (nodeId) => {
    const { sessionId } = get();
    if (!sessionId) return;
    set({ suggestionsLoading: true });
    try {
      const data = await getSuggestions(sessionId, nodeId);
      set({ suggestions: data.suggestions || [], suggestionsLoading: false });
    } catch (err) {
      set({ suggestions: [], suggestionsLoading: false });
    }
  },

  loadNarration: async (nodeId) => {
    const { sessionId } = get();
    if (!sessionId) return;
    set({ narrationLoading: true });
    try {
      const data = await getNarration(sessionId, nodeId);
      set({ narrationText: data.narrationText, narrationLoading: false });
    } catch (err) {
      set({ narrationLoading: false, error: err.message });
    }
  },

  parseVoiceInput: async (transcript) => {
    try {
      return await parseVoice(transcript);
    } catch {
      return { intent: 'unknown', description: transcript };
    }
  },
}));

export default useStore;
