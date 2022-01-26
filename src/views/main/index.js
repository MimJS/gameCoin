import {
  Avatar,
  Panel,
  PanelHeader,
  PanelHeaderContent,
  View,
} from "@vkontakte/vkui";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CoinIcon } from "../../lib/icons";
import CoinIconUrl from "../../lib/icons/coin.svg";
import { PAGE_PROFILE } from "../../lib/scripts/routes";
import { number_format } from "../../lib/scripts/util";
import BottomMenu from "./bottomMenu";

const MainView = ({
  id,
  go,
  createSocket,
  history,
  mainPanel,
  onSwipeBack,
}) => {
  //? variables
  const userData = useSelector((s) => s.user);
  const ui = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const socket = useSelector((s) => s.config.socket);
  useEffect(() => {
    if (socket == null) createSocket();
  }, []);
  return (
    <View
      id={id}
      activePanel="mainView--panel_main"
      popout={ui.popout.mainView}
      history={history}
      onSwipeBack={onSwipeBack}
    >
      <Panel id={mainPanel}>
        <PanelHeader separator={false}>
          <PanelHeaderContent
            before={
              <Avatar
                size={40}
                src={userData?.dbData?.vk?.photo_100}
                onClick={() => go(PAGE_PROFILE)}
              />
            }
            status={
              Object.keys(userData.dbData).length === 0
                ? "..."
                : `Онлайн: ${userData.usersOnline}`
            }
          >
            {Object.keys(userData.dbData).length === 0
              ? ""
              : userData?.dbData?.vk?.first_name +
                " " +
                userData?.dbData?.vk?.last_name}
          </PanelHeaderContent>
        </PanelHeader>
        {Object.keys(userData.dbData).length > 0 && (
          <>
            <div className="gameContent">
              <div className="balance">
                  <span className="header">Ваш счет:</span>
                <div className="coins">
                  <span className="sum">
                    {number_format(userData?.dbData?.coins / 1000)}
                  </span>
                  <CoinIcon width={28} height={28} />
                </div>
                <span className="perSec subheader">
                  + {number_format(userData?.dbData?.mine / 1000)} / сек.
                </span>
                <span className="perClick subheader">
                  + {number_format(userData?.dbData?.click / 1000)} / клик.
                </span>
              </div>
              <div className="clickCoin">
                <img
                  src={CoinIconUrl}
                  onClick={() => {
                    dispatch({
                      type: "addClick",
                      payload: null,
                    });
                    socket.emit(`event`, { action: "initClick" });
                  }}
                />
              </div>
            </div>
            <BottomMenu go={go} />
          </>
        )}
      </Panel>
    </View>
  );
};

export default MainView;
