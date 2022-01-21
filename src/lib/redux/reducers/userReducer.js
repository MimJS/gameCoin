const init = {
  dbData: {},
  //? Profile data
  usersOnline: 0,
  errorData: {},
};

export const userReducer = (state = init, action) => {
  switch (action.type) {
    case "updateOnline":
      return { ...state, usersOnline: action.payload };
    case "setDbData":
      return { ...state, dbData: action.payload };
    case "setErrorData":
      return {
        ...state,
        errorData: action.payload
      };
    default:
      return state;
  }
};
