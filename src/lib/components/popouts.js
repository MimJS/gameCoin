const popouts = {
  receive: null,
};

export const getPopout = (name) => {
  const selectedPopout = popouts[name];
  if (selectedPopout) {
    return selectedPopout;
  } else {
    return null;
  }
};
