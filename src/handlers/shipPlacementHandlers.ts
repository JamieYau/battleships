export function handleDragStart(event: DragEvent) {
  const target = event.target as HTMLElement;
  target.classList.add("dragging");
  const ship = target.parentElement;
  ship?.classList.add("dragging");
  const shipLength = ship?.dataset.shipLength;
  if (!shipLength) return;
  console.log(shipLength);
  const dragEvent = event; // No need to cast here
  dragEvent.dataTransfer?.setData("text/plain", shipLength);
}

export function handleDragEnd(event: DragEvent) {
  const target = event.target as HTMLElement;
  target.classList.remove("dragging");
  const ship = target.parentElement;
  ship?.classList.remove("dragging");
}

export function handleDrop(event: DragEvent) {
  event.preventDefault();
  const targetCell = event.target as HTMLElement;
  const shipLength = event.dataTransfer?.getData("text/plain");
  if (!shipLength) return;
  const row = parseInt(targetCell.dataset.row || "");
  const col = parseInt(targetCell.dataset.col || "");
  console.log(`row: ${row}, col: ${col}`);
  console.log(`shipLength: ${shipLength}`);
}
