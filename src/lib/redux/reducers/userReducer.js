const init = {
  dbData: {},
  //? Profile data
  usersOnline: 0,
  errorData: {},
};

export const userReducer = (state = init, action) => {
  switch (action.type) {
    case "addMine":
      if (state.dbData && Object.keys(state.dbData).length > 0) {
        return {
          ...state,
          dbData: {
            ...state.dbData,
            coins: Number(state.dbData.coins + state.dbData.mine),
          },
        };
      } else {
        return state;
      }
    case "addClick":
      if (state.dbData && Object.keys(state.dbData).length > 0) {
        return {
          ...state,
          dbData: {
            ...state.dbData,
            coins: Number(state.dbData.coins + state.dbData.click),
          },
        };
      } else {
        return state;
      }
    case "updateOnline":
      return { ...state, usersOnline: action.payload };
    case "setDbData":
      return { ...state, dbData: action.payload };
    case "setErrorData":
      return {
        ...state,
        errorData: action.payload,
      };
    default:
      return state;
  }
};
