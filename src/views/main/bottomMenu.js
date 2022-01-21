import { FixedLayout } from "@vkontakte/vkui";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPopout } from "../../lib/components/popouts";
import { RatingIcon, TransferIcon, MoreIcon, GamesIcon } from "../../lib/icons";

const BottomMenu = ({go}) => {
  const [activeTab, setActiveTab] = useState(0);
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
  );
};

export default BottomMenu;
