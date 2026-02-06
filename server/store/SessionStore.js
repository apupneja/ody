class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  create(sessionId, { graph, renderPacks, metadata }) {
    const session = {
      graph,
      renderPacks: renderPacks instanceof Map ? renderPacks : new Map(),
      metadata,
      createdAt: Date.now(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  get(sessionId) {
    return this.sessions.get(sessionId) ?? null;
  }

  addRenderPack(sessionId, renderPack) {
    const session = this.get(sessionId);
    if (!session) return null;
    session.renderPacks.set(renderPack.id, renderPack);
    return renderPack;
  }
}

export default new SessionStore();
