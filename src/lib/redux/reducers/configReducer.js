const init = {
  server_url: "https://2a432694c22575.lhr.life",
  socket: null,
  vkToken: null,
};

export const configReducer = (state = init, action) => {
  switch (action.type) {
    case "setSocket":
      return { ...state, socket: action.payload };
    case "setVkToken":
      return { ...state, vkToken: action.payload };
    default:
      return state;
  }
};
