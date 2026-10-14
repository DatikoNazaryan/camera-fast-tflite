import { AppState, AppStateStatus } from "react-native";
import { useEffect, useState } from "react";

function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const listener = AppState.addEventListener("change", (state) => {
      setAppState(state);
    });

    return () => {
      listener?.remove();
    };
  }, []);

  return appState;
}
export default useAppState;