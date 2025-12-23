const DEBUG: boolean = process.env.NODE_ENV !== "production";

export const log = (...args: unknown[]): void => {
  if (DEBUG) {
    console.log(...args);
  }
};

export const warn = (...args: unknown[]): void => {
  if (DEBUG) {
    console.warn(...args);
  }
};

export const error = (...args: unknown[]): void => {
  console.error(...args);
};
