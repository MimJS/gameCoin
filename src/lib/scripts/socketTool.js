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
        case "getPlayersRating":
          dispatch({
            type: "setRatingData",
            payload: { ratingName: "error", data: false },
          });
          dispatch({
            type: "setRatingData",
            payload: { ratingName: "all", data: ctx.response.rating },
          });
          dispatch({
            type: "setRatingData",
            payload: { ratingName: "myTop", data: ctx.response.player },
          });
          return;
        case "getGroupsRating":
          dispatch({
            type: "setRatingData",
            payload: { ratingName: "error", data: false },
          });
          dispatch({
            type: "setRatingData",
            payload: { ratingName: "groups", data: ctx.response.rating },
          });
          dispatch({
            type: "setRatingData",
            payload: { ratingName: "myGroup", data: ctx.response.group },
          });
          return;
        case "updateOnline":
          dispatch({
            type: "updateOnline",
            payload: ctx.response.online,
          });
          return;
        default:
          return;
      }
    } else {
      if (ctx.type === "errorNotify" || ctx.type === "connection") {
        initError(ctx.response);
        return;
      }
      if (ctx.type === "getPlayersRating" || ctx.type === "getGroupsRating") {
        dispatch({
          type: "setRatingData",
          payload: { ratingName: "error", data: true },
        });
        return;
      }
    }
  });
  socket.on("disconnect", async (reason) => {
    console.log("off");
    clearInterval(timer.current);
    if (
      reason === "io server disconnect" ||
      reason === "io client disconnect"
    ) {
      return;
    }
    initError();
  });
};
