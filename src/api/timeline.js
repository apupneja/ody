import { get, post } from './client.js';

export function getTimeline(sessionId, branchId = 'main') {
  return get(`/scenarios/${sessionId}/timeline?branchId=${branchId}`);
}

export function getNodeDetail(sessionId, nodeId) {
  return get(`/scenarios/${sessionId}/timeline/nodes/${nodeId}`);
}

export function executeFork(sessionId, nodeId, description) {
  return post(`/scenarios/${sessionId}/timeline/fork`, { nodeId, description });
}

export function getSuggestions(sessionId, nodeId) {
  return get(`/scenarios/${sessionId}/timeline/nodes/${nodeId}/suggestions`);
}

export function getVideoSession(sessionId, renderPackId) {
  return post(`/scenarios/${sessionId}/render/${renderPackId}/video-session`, {});
}
