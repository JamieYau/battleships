import "./assets/style.css";
import { showStartScreen } from "./components/StartScreen";

showStartScreen();

const form = document.getElementById("start-form") as HTMLFormElement;
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const playerNameInput = document.getElementById(
    "player-name"
  ) as HTMLInputElement;
  if (playerNameInput) {
    const playerName = playerNameInput.value;
    startGame(playerName);
  }
});
