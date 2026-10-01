/* Estado de controles compartido entre el HUD (React) y el loop del
   juego (useFrame). Es un objeto mutable a propósito: se lee 60 veces
   por segundo y no tiene que disparar renders. */

export const input = {
  keys: new Set<string>(),
  /* Joystick táctil, valores entre -1 y 1 */
  joyX: 0,
  joyY: 0,
  /* Mientras hay una ficha abierta el personaje no se mueve */
  frozen: false,
};

const MOVE_KEYS: Record<string, [number, number]> = {
  KeyW: [0, -1],
  ArrowUp: [0, -1],
  KeyS: [0, 1],
  ArrowDown: [0, 1],
  KeyA: [-1, 0],
  ArrowLeft: [-1, 0],
  KeyD: [1, 0],
  ArrowRight: [1, 0],
};

export function isMoveKey(code: string) {
  return code in MOVE_KEYS;
}

/* Dirección de movimiento normalizada (x, z) */
export function readDirection(): [number, number] {
  if (input.frozen) return [0, 0];

  let x = input.joyX;
  let z = input.joyY;

  for (const code of input.keys) {
    const dir = MOVE_KEYS[code];
    if (dir) {
      x += dir[0];
      z += dir[1];
    }
  }

  const len = Math.hypot(x, z);
  if (len > 1) return [x / len, z / len];
  return [x, z];
}

/* Posición del personaje en el piso (x, z). La lee la cámara y la
   escribe el directorio de artistas cuando teletransporta. */
export const player = {
  x: 0,
  z: 4,
};
