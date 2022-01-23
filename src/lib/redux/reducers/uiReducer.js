import { ScreenSpinner } from "@vkontakte/vkui";

const init = {
  popout: {
    mainView: <ScreenSpinner size="medium" />,
    ratingView: <ScreenSpinner size="medium" />,
  },
  history: ["main"],
};

export const uiReducer = (state = init, action) => {
  switch (action.type) {
    case "setPopout":
      let newValue = { ...state.popout };
      newValue[action.payload.viewName] = action.payload.popout;
      return { ...state, popout: newValue };
    case "addHistory":
      let newHistoryList = [...state.history];
      newHistoryList.push(action.payload);
      return { ...state, history: newHistoryList };
    case "setNewHistory":
      return { ...state, history: action.payload };
    case "defaultHistory":
      return { ...state, history: ["main"] };
    case "goBackHistory":
      let newHistory = [...state.history];
      newHistory.pop();
      console.log(newHistory);
      return { ...state, history: newHistory };
    default:
      return state;
  }
};
