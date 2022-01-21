const init = {
  vkData: {},
};

export const userReducer = (state = init, action) => {
  switch (action.type) {
    case "setVkData":
      return { ...state, vkData: action.payload };
    default:
      return state;
  }
};
