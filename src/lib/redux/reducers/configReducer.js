const init = {
  server_url: "https://52f652fa9b8d34.lhr.life",
  socket: null,
  vkToken: null,
  appId: 8057051,
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
