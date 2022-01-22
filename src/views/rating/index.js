import {
  Panel,
  PanelHeader,
  PanelHeaderContent,
  View,
  PanelHeaderButton,
  PullToRefresh,
  SimpleCell,
  List,
  Avatar,
  FixedLayout,
} from "@vkontakte/vkui";
import { Icon28ChevronBack } from "@vkontakte/icons";
import {
  CoinIcon,
  RatingOneIcon,
  RatingTwoIcon,
  RatingThreeIcon,
} from "../../lib/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
const RatingView = ({ id, back }) => {
  const [isFetch, setIsFetch] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const socket = useSelector((s) => s.config.socket);
  const ratingData = useSelector((s) => s.user.ratingData);
  const tabs = [
    {
      name: "Общий",
    },
    {
      name: "Группы",
    },
    {
      name: "Друзья",
    },
  ];

  //? functions
  const selectTab = (id) => {
    if (activeTab !== id) setActiveTab(id);
  };
  return (
    <View id={id} activePanel="ratingView--panel_main">
      <Panel id="ratingView--panel_main">
        <PanelHeader
          separator={false}
          left={
            <PanelHeaderButton
              onClick={() => back()}
              hasActive={false}
              hasHover={false}
            >
              <Icon28ChevronBack />
            </PanelHeaderButton>
          }
        >
          <PanelHeaderContent>Рейтинг</PanelHeaderContent>
        </PanelHeader>
        <PullToRefresh
          isFetching={isFetch}
          onRefresh={() =>
            setIsFetch(true) &
            setTimeout(() => {
              setIsFetch(false);
            }, 1000)
          }
        >
          <div className={`mainRating ${activeTab === 0 ? "opened" : ""}`}>
            <div className="top3">
              <div className="user">
                <Avatar
                  size={72}
                  src={
                    "https://sun2-12.userapi.com/s/v1/if1/3skihU8qE8H4URxyGbGi1FFTJVntIecGdA-VhTAvXwfj8Neh18E5Qur7piejQsmdOB5Gd6xx.jpg?size=100x100&quality=96&crop=514,119,337,337&ava=1"
                  }
                />
                <div className="position pos2">
                  <div className="position--in">
                    <div className="position--in_shadow" />
                    <RatingTwoIcon />
                  </div>
                </div>
              </div>
              <div className="user">
                <Avatar
                  size={96}
                  src={
                    "https://sun2-12.userapi.com/s/v1/if1/3skihU8qE8H4URxyGbGi1FFTJVntIecGdA-VhTAvXwfj8Neh18E5Qur7piejQsmdOB5Gd6xx.jpg?size=100x100&quality=96&crop=514,119,337,337&ava=1"
                  }
                />
                <div className="position pos1">
                  <div className="position--in">
                    <div className="position--in_shadow" />
                    <RatingOneIcon />
                  </div>
                </div>
              </div>
              <div className="user">
                <Avatar
                  size={72}
                  src={
                    "https://sun2-12.userapi.com/s/v1/if1/3skihU8qE8H4URxyGbGi1FFTJVntIecGdA-VhTAvXwfj8Neh18E5Qur7piejQsmdOB5Gd6xx.jpg?size=100x100&quality=96&crop=514,119,337,337&ava=1"
                  }
                />
                <div className="position pos3">
                  <div className="position--in">
                    <div className="position--in_shadow" />
                    <RatingThreeIcon />
                  </div>
                </div>
              </div>
            </div>
            <div className="mainRating--content">
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
              <List className="ratingList">
                <SimpleCell
                  before={<Avatar size={40} />}
                  description={
                    <div className="ratingSum">
                      <span>10</span>
                      <CoinIcon />
                    </div>
                  }
                  className="ratingBlock"
                  indicator={<span className="ratingPosition">1 место</span>}
                  hasHover={false}
                  hasActive={false}
                >
                  Андрей Смирнов
                </SimpleCell>
              </List>
            </div>
          </div>
        </PullToRefresh>
        {activeTab === 0 && (
          <FixedLayout vertical="bottom" className="myTop">
            <SimpleCell
              before={<Avatar size={40} />}
              description={
                <div className="ratingSum">
                  <span>10</span>
                  <CoinIcon />
                </div>
              }
              className="ratingBlock"
              indicator={<span className="ratingPosition">~ 1 место</span>}
              hasHover={false}
              hasActive={false}
            >
              Андрей Смирнов
            </SimpleCell>
          </FixedLayout>
        )}
      </Panel>
    </View>
  );
};

export default RatingView;
