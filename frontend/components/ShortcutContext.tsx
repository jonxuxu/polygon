import React from "react";

export const ShortcutContext = React.createContext({
  shortcutsEnabled: true,
  toggleShortcuts: (val: boolean) => {},
});
