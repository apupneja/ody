import { post } from './client.js';

export function getNarration(sessionId, nodeId) {
  return post(`/scenarios/${sessionId}/narrate`, { nodeId });
}
