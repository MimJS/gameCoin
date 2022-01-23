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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import bridge from "@vkontakte/vk-bridge";
import { number_format } from "../../lib/scripts/util";

const RatingView = ({ id, back }) => {
  const [isFetch, setIsFetch] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [awaitSort, setAwaitSort] = useState(false);
  const [sortStarted, setSortStarted] = useState(false);
  const [localRating, setLocalRating] = useState({
    all: [],
    groups: [],
    friends: [],
    error: false,
  });
  const [view, setView] = useState(false);
  const ratingData = useSelector((s) => s.user.ratingData);
  const socket = useSelector((s) => s.config.socket);
  const vkToken = useSelector((s) => s.config.vkToken);
  const userData = useSelector((s) => s.user.dbData);
  const popout = useSelector((s) => s.ui.popout.ratingView);
  const appId = useSelector((s) => s.config.appId);
  const dispatch = useDispatch();
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
  const getVkToken = () => {
    return new Promise(async (resolve, reject) => {
      const token = await bridge
        .send("VKWebAppGetAuthToken", {
          app_id: appId,
          scope: "friends",
        })
        .catch((e) => resolve(null));
      console.log(token);
      if (token.access_token) {
        resolve(token.access_token);
      } else {
        resolve(null);
      }
    });
  };
  const getUserInfo = async (ids) => {
    if (ratingData.error) {
      return;
    }
    const token = vkToken ? vkToken : await getVkToken();
    console.log(token);
    if (!token) {
      setLocalRating({
        ...localRating,
        all: ratingData.all,
      });
      setAwaitSort(false);
      setSortStarted(false);
      setView(true);
      return;
    }
    dispatch({
      type: "setVkToken",
      payload: token,
    });
    const userInfo = await bridge.send("VKWebAppCallAPIMethod", {
      method: "users.get",
      request_id: "gameCoin_request",
      params: {
        user_ids: ids,
        fields: "photo_100",
        v: "5.131",
        access_token: token,
      },
    });
    let rating = [];
    userInfo.response.forEach((v, i) => {
      rating.push({
        ...v,
        ...ratingData.all[i],
      });
    });
    setLocalRating({
      ...localRating,
      all: rating,
    });
    setAwaitSort(false);
    setSortStarted(false);
    setView(true);
    return;
  };

  useEffect(() => {
    if (localRating.all.length === 0 && !awaitSort) {
      socket.emit(`event`, {
        action: "getPlayersRating",
      });
      setAwaitSort(true);
    } else if (ratingData.all.length > 0) {
      console.log(awaitSort);
      if (awaitSort) {
        console.log(activeTab);
        if (activeTab === 0 && !sortStarted) {
          let usersId = "";
          ratingData.all.forEach((v, i) => {
            usersId += `${v.id},`;
          });
          getUserInfo(usersId);
          setSortStarted(true);
        }
      }
    } else {
      console.log(ratingData);
    }
  }, [ratingData, awaitSort, activeTab, sortStarted]);
  useEffect(() => {
    console.log(localRating);
  }, [localRating]);

  const onRefresh = () => {
    setIsFetch(true);
    if (activeTab === 0) {
      socket.emit(`event`, {
        action: "getPlayersRating",
      });
      setAwaitSort(true);
      setIsFetch(false);
    } else {
      setIsFetch(false);
    }
  };

  return (
    <View
      id={id}
      activePanel="ratingView--panel_main"
      popout={awaitSort ? popout : null}
    >
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
        <PullToRefresh isFetching={isFetch} onRefresh={() => onRefresh()}>
          <div className={`mainRating ${activeTab === 0 ? "opened" : ""}`}>
            <div className="top3">
              <div className="user">
                <Avatar size={72} src={localRating.all[1]?.photo_100} />
                <div className="position pos2">
                  <div className="position--in">
                    <div className="position--in_shadow" />
                    <RatingTwoIcon />
                  </div>
                </div>
              </div>
              <div className="user">
                <Avatar size={96} src={localRating.all[0]?.photo_100} />
                <div className="position pos1">
                  <div className="position--in">
                    <div className="position--in_shadow" />
                    <RatingOneIcon />
                  </div>
                </div>
              </div>
              <div className="user">
                <Avatar size={72} src={localRating.all[2]?.photo_100} />
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
                {view &&
                  activeTab === 0 &&
                  localRating.all.map((v, i) => (
                    <SimpleCell
                      key={i}
                      onClick={() =>
                        window.open("https://vk.com/id" + v.id, "_blank")
                      }
                      before={<Avatar size={40} src={v.photo_100} />}
                      description={
                        <div className="ratingSum">
                          <span>{number_format(v.coins / 1000)}</span>
                          <CoinIcon />
                        </div>
                      }
                      className="ratingBlock"
                      indicator={
                        <span className="ratingPosition">{i + 1} место</span>
                      }
                      hasHover={false}
                      hasActive={false}
                    >
                      {v.first_name
                        ? v.first_name + " " + v.last_name
                        : `@id` + v.id}
                    </SimpleCell>
                  ))}
              </List>
            </div>
          </div>
        </PullToRefresh>
        {view && activeTab === 0 && Object.keys(ratingData.myTop).length > 0 && (
          <FixedLayout vertical="bottom" className="myTop">
            <SimpleCell
              before={<Avatar size={40} src={userData?.vk?.photo_100} />}
              description={
                <div className="ratingSum">
                  <span>{number_format(ratingData.myTop.coins / 1000)}</span>
                  <CoinIcon />
                </div>
              }
              className="ratingBlock"
              indicator={
                <span className="ratingPosition">
                  ~ {ratingData.myTop.position} место
                </span>
              }
              hasHover={false}
              hasActive={false}
            >
              {userData?.vk?.first_name + " " + userData?.vk?.last_name}
            </SimpleCell>
          </FixedLayout>
        )}
      </Panel>
    </View>
  );
};

export default RatingView;
