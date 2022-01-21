import { ScreenSpinner } from "@vkontakte/vkui";

const init = {
  popout: {
    mainView: <ScreenSpinner size="medium" />,
  },
};

export const uiReducer = (state = init, action) => {
  switch (action.type) {
    case "setPopout":
      let newValue = { ...state.popout };
      newValue[action.payload.viewName] = action.payload.popout;
      return { ...state, popout: newValue };
    default:
      return state;
  }
};
