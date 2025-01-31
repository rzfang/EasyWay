function debounce (action: () => void, delayedMillisecond: number): () => void {
  let timer = -1;

  return (...params) => {
    if (timer !== -1) {
      clearTimeout(timer);

      timer = -1;
    }

    timer = setTimeout(() => action(...params), delayedMillisecond);
  };
}

export {
  debounce,
};
