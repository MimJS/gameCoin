const init = {
  server_url: "https://50476a04ce57fc.lhr.life",
  socket:null
};

export const configReducer = (state = init, action) => {
  switch (action.type) {
    case 'setSocket':
      return {...state, socket:action.payload}
    default:
      return state;
  }
};
