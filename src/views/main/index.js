import {
  Avatar,
  Panel,
  PanelHeader,
  PanelHeaderContent,
  View,
} from "@vkontakte/vkui";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { CoinIcon } from "../../lib/icons";
import CoinIconUrl from "../../lib/icons/coin.svg";
import BottomMenu from "./bottomMenu";

const MainView = ({ id, go, createSocket }) => {
  //? variables
  const userData = useSelector((s) => s.user);
  const ui = useSelector((s) => s.ui);
  useEffect(() => {
    createSocket()
  }, [])
  return (
    <View
      id={id}
      activePanel="mainView--panel_main"
      popout={ui.popout.mainView}
    >
      <Panel id="mainView--panel_main">
        <PanelHeader separator={false}>
          <PanelHeaderContent
            before={<Avatar size={40} src={userData?.dbData?.vk?.photo_100} />}
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
                  <span className="sum">0</span>
                  <CoinIcon width={28} height={28} />
                </div>
                <span className="perSec subheader">+ 0.000 / сек.</span>
                <span className="perClick subheader">+ 0.001 / клик.</span>
              </div>
              <div className="clickCoin">
                <img src={CoinIconUrl} />
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
