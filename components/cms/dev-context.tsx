import React, { createContext, useContext, type ReactNode } from 'react';

const DevContext = createContext(false);

/** Enables development-only output, such as placeholders for unsupported Notion blocks. */
export function DevProvider({ isDev, children }: { isDev: boolean; children: ReactNode }) {
    return <DevContext.Provider value={isDev}>{children}</DevContext.Provider>;
}

export function useIsDev(): boolean {
    return useContext(DevContext);
}
