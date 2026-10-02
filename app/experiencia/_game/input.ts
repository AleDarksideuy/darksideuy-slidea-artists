/* Estado compartido entre el HUD (React) y el loop del juego (useFrame).
   Son objetos mutables a propósito: se leen 60 veces por segundo y no
   tienen que disparar renders. */

export const input = {
  keys: new Set<string>(),
  /* Joystick táctil, valores entre -1 y 1 */
  joyX: 0,
  joyY: 0,
  /* Destino al tocar/clickear el piso */
  target: null as [number, number] | null,
  /* Mientras hay un panel abierto el personaje no se mueve */
  frozen: false,
};

/* Posición del personaje en el piso (x, z) */
export const player = {
  x: 0,
  z: 0,
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

  /* Teclado o joystick cancelan el "ir hasta acá" */
  if (x !== 0 || z !== 0) {
    input.target = null;
  } else if (input.target) {
    x = input.target[0] - player.x;
    z = input.target[1] - player.z;
    if (Math.hypot(x, z) < 0.15) {
      input.target = null;
      return [0, 0];
    }
  }

  const len = Math.hypot(x, z);
  if (len > 1) return [x / len, z / len];
  return [x, z];
}
