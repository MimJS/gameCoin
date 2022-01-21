export const socketListener = (socket, dispatch) => {
  socket.on("connect", function (ctx) {
    dispatch({
      type: "setPopout",
      payload: {
        viewName: "mainView",
        popout: null,
      },
    });
    console.log("Connected!");
  });
  socket.on("event", async (ctx) => {
    console.log(ctx);
    if (ctx.status) {
      switch (ctx.type) {
        case "getPlayerData":
          dispatch({
            type: "setDbData",
            payload: ctx.response,
          });
          return;
        case "updateOnline":
          dispatch({
            type: "updateOnline",
            payload: ctx.response.online,
          });
        default:
          return;
      }
    } else {
    }
  });
  socket.on("disconnect", async () => {
    console.log("off");
  });
};
