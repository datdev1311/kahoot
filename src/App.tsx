import { useState, useCallback } from "react";
import { HomeScreen } from "@/screens/HomeScreen";
import { SoloSetupScreen } from "@/screens/SoloSetupScreen";
import { SoloQuizScreen } from "@/screens/SoloQuizScreen";
import { SoloResultScreen } from "@/screens/SoloResultScreen";
import { HostSetupScreen } from "@/screens/HostSetupScreen";
import { HostLobbyScreen } from "@/screens/HostLobbyScreen";
import { HostQuestionScreen } from "@/screens/HostQuestionScreen";
import { HostPodiumScreen } from "@/screens/HostPodiumScreen";
import { PlayerJoinScreen } from "@/screens/PlayerJoinScreen";
import { PlayerLobbyScreen } from "@/screens/PlayerLobbyScreen";
import { PlayerAnswerScreen } from "@/screens/PlayerAnswerScreen";
import { ReviewSelectScreen } from "@/screens/ReviewSelectScreen";
import type { Screen } from "@/lib/types";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [screenData, setScreenData] = useState<any>(null);

  const navigate = useCallback((newScreen: Screen, data?: any) => {
    setScreenData(data ?? null);
    setScreen(newScreen);
  }, []);

  switch (screen) {
    case "home":
      return <HomeScreen onNavigate={navigate} />;
    case "solo-setup":
      return <SoloSetupScreen onNavigate={navigate} />;
    case "solo-quiz":
      return <SoloQuizScreen onNavigate={navigate} data={screenData} />;
    case "solo-result":
      return <SoloResultScreen onNavigate={navigate} data={screenData} />;
    case "host-setup":
      return <HostSetupScreen onNavigate={navigate} />;
    case "host-lobby":
      return <HostLobbyScreen onNavigate={navigate} data={screenData} />;
    case "host-question":
      return <HostQuestionScreen onNavigate={navigate} data={screenData} />;
    case "host-podium":
      return <HostPodiumScreen onNavigate={navigate} data={screenData} />;
    case "player-join":
      return <PlayerJoinScreen onNavigate={navigate} />;
    case "player-lobby":
      return <PlayerLobbyScreen onNavigate={navigate} data={screenData} />;
    case "player-answer":
      return <PlayerAnswerScreen onNavigate={navigate} data={screenData} />;
    case "review-select":
      return <ReviewSelectScreen onNavigate={navigate} />;
    default:
      return <HomeScreen onNavigate={navigate} />;
  }
}

export default App;
