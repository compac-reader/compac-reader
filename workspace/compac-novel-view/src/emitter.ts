export function createEmitter<T>() {
  type Handler = (e: T) => void;
  const handlers: Handler[] = [];

  const listener = {
    on(func: Handler) {
      handlers.push(func);
    },
    off(func: Handler) {
      const index = handlers.findIndex((f) => f === func);
      if (index !== -1) handlers.splice(index, 1);
    },
    offAll() {
      handlers.length = 0;
    }
  };

  const emit = (e: T) => {
    handlers.forEach((handler) => handler(e));
  };

  return {listener, emit};
}
