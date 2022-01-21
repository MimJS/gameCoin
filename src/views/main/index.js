import {
  Avatar,
  Panel,
  PanelHeader,
  PanelHeaderContent,
  View,
  ScreenSpinner,
  FixedLayout,
} from "@vkontakte/vkui";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPopout } from "../../lib/components/popouts";
import { RatingIcon, TransferIcon, MoreIcon, GamesIcon } from "../../lib/icons";

const MainView = ({ id, go }) => {
  //? variables
  const [activeTab, setActiveTab] = useState(0);
  const userData = useSelector((s) => s.user);
  const ui = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const tabs = [
    {
      name: "Меню",
      onClick: () => console.log(`null`),
    },
    {
      name: "Улучшения",
    },
    {
      name: "Бонусы",
    },
  ];
  const menu = [
    {
      name: "Рейтинг",
      icon: <RatingIcon />,
      location: "rating",
    },
    {
      name: "Перевести",
      icon: <TransferIcon />,
      location: "transfer",
    },
    {
      name: "Принять",
      icon: <MoreIcon />,
      popoutName: "receive",
    },
    {
      name: "Игры",
      icon: <GamesIcon />,
      location: "games",
    },
  ];

  //? functions
  const selectTab = (id) => {
    if (activeTab !== id) setActiveTab(id);
  };
  return (
    <View
      id={id}
      activePanel="mainView--panel_main"
      popout={ui.popout.mainView}
    >
      <Panel id="mainView--panel_main">
        <PanelHeader separator={false}>
          <PanelHeaderContent
            before={<Avatar size={40} src={userData.vkData?.photo_100} />}
            status={
              Object.keys(userData.vkData).length === 0 ? "..." : "Онлайн: 1"
            }
          >
            {Object.keys(userData.vkData).length === 0
              ? ""
              : userData.vkData?.first_name + " " + userData.vkData?.last_name}
          </PanelHeaderContent>
        </PanelHeader>
        {Object.keys(userData.vkData).length > 0 && (
          <>
            <FixedLayout vertical="bottom" className="bottomMenu">
              <div className="tabs">
                {tabs.map((v, i) => (
                  <div
                    key={i}
                    className={`tab ${activeTab === i ? "selected" : ""}`}
                    onClick={() => {
                      selectTab(i);
                      if (v.onClick) {
                        v.onClick();
                      }
                    }}
                  >
                    {v?.name}
                  </div>
                ))}
              </div>
              <div className="menu">
                {menu.map((v, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (v.location) {
                        go(v.location);
                      } else if (v.popoutName) {
                        dispatch({
                          type: "setPopout",
                          payload: {
                            viewName: "mainView",
                            popout: getPopout(v.popoutName),
                          },
                        });
                      }
                    }}
                    className="menuButton"
                  >
                    {v?.icon}
                    <span className="title">{v.name}</span>
                  </div>
                ))}
              </div>
            </FixedLayout>
          </>
        )}
      </Panel>
    </View>
  );
};

export default MainView;
