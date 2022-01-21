export const socketListener = (socket, dispatch, go, initError, timer) => {
  const mine = () => {
    timer.current = setInterval(() => {
        dispatch({
          type: "addMine",
          payload: null,
        });
      }, 1000);
  };
  socket.on("connect_error", () => {
    initError();
  });
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
          mine();
          dispatch({
            type: "setDbData",
            payload: ctx.response,
          });
          return;
        case "updatePlayerData":
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
      if (ctx.type === "errorNotify" || ctx.type === "connection") {
        initError(ctx.response);
      }
    }
  });
  socket.on("disconnect", async (reason) => {
    console.log("off");
    clearInterval(timer.current);
    if (reason === "io server disconnect") {
      return;
    }
    initError();
  });
};
