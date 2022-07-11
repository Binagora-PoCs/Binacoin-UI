import React from "react";

export const PendingTxsContext = React.createContext({
    pendingTxs: 0,
    incPendingTxs: () => {},
    decPendingTxs: () => {},
  });