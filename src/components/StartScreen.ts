// StartScreen.ts
export function showStartScreen(): void {
  const container = document.getElementById("app");
  if (!container) return;

  const template = `
      <div id="start-container">
        <h1>Battleship</h1>
        <form id="start-form" autocomplete="off">
          <label for="player">Enter Name:</label>
          <input type="text" id="player-name" name="player" placeholder="name"/>
          <button>Start Game</button>
        </form>
      </div>
  `;

  container.innerHTML = template;
}
