import { useEffect, useRef } from "react";

const noop = () => {};

export const useInterval = (
  callback: () => void,
  delay: number | null | false,
  immediate?: boolean
) => {
  const savedCallback = useRef(noop);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (!immediate || delay === null || delay === false) return;
    savedCallback.current();
  }, [immediate]);

  useEffect(() => {
    if (delay === null || delay === false) return;
    const tick = () => savedCallback.current();

    intervalId.current = setInterval(tick, delay);

    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
    };
  }, [delay]);

  const clear = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  return clear;
};
