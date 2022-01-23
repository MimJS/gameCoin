const init = {
  dbData: {},
  //? Profile data
  usersOnline: 0,
  errorData: {
    showButton: true,
  },
  ratingData: {
    all: [],
    groups: [],
    friends: [],
    error: false,
    myTop: {},
    myGroup: false,
  },
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
        errorData: {
          ...action.payload,
          showButton: action.showButton != null ? action.showButton : true,
        },
      };
    case "setRatingData":
      let newValue = { ...state.ratingData };
      newValue[action.payload.ratingName] = action.payload.data;
      return { ...state, ratingData: newValue };
    default:
      return state;
  }
};
