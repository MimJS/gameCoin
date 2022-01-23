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
import { Icon28ChevronBack, Icon28AddCircleOutline } from "@vkontakte/icons";
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
    myGroup: null,
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
    if (activeTab !== id) {
      setActiveTab(id);
      if (id === 1 && localRating.groups.length === 0) {
        socket.emit(`event`, {
          action: "getGroupsRating",
        });
        setAwaitSort(true);
        setView(false);
      }
    }
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

  const getGroupInfo = async (ids) => {
    console.log(ids);
    if (ratingData.error) {
      return;
    }
    const token = vkToken ? vkToken : await getVkToken();
    console.log(token);
    if (!token) {
      setLocalRating({
        ...localRating,
        groups: ratingData.groups,
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
    const groupInfo = await bridge.send("VKWebAppCallAPIMethod", {
      method: "groups.getById",
      request_id: "gameCoin_request",
      params: {
        group_ids: ids,
        v: "5.131",
        access_token: token,
      },
    });
    let rating = [];
    groupInfo.response.forEach((v, i) => {
      rating.push({
        ...v,
        ...ratingData.groups[i],
      });
    });
    setLocalRating({
      ...localRating,
      groups: rating,
    });
    setAwaitSort(false);
    setSortStarted(false);
    setView(true);
    return;
  };

  useEffect(async () => {
    console.log(localRating);
    if (activeTab === 0) {
      if (localRating.all.length === 0 && !awaitSort) {
        socket.emit(`event`, {
          action: "getPlayersRating",
        });
        setAwaitSort(true);
      } else if (ratingData.all.length > 0) {
        console.log(awaitSort);
        if (awaitSort) {
          console.log(activeTab);
          if (!sortStarted) {
            let usersId = "";
            ratingData.all.forEach((v, i) => {
              usersId += `${v.id},`;
            });
            getUserInfo(usersId);
            setSortStarted(true);
          }
        }
      }
    }

    if (
      activeTab === 1 &&
      !sortStarted &&
      awaitSort &&
      ratingData.groups.length > 0
    ) {
      let groupsId = "";
      ratingData.groups.forEach((v, i) => {
        groupsId += `${Math.abs(v.id)},`;
      });
      console.log(groupsId);
      console.log(ratingData);
      await getGroupInfo(groupsId);
      setSortStarted(true);
      GetLocalGroup(ratingData);
    } else {
      console.log(sortStarted);
    }
  }, [ratingData, awaitSort, activeTab, sortStarted]);

  const onRefresh = () => {
    setIsFetch(true);
    if (activeTab === 0) {
      socket.emit(`event`, {
        action: "getPlayersRating",
      });
      setSortStarted(false);
      setAwaitSort(true);
    }
    if (activeTab === 1) {
      socket.emit(`event`, {
        action: "getGroupsRating",
      });
      setSortStarted(false);
      setAwaitSort(true);
    }
    setIsFetch(false);
    return;
  };

  const GetLocalGroup = async (ratingData) => {
    console.log(ratingData);
    const token = vkToken ? vkToken : await getVkToken();
    if (!token) {
      const groupInfo = ratingData.myGroup;
      return setLocalRating((p) => ({
        ...p,
        myGroup: groupInfo,
      }));
    } else {
      const groupinfo = await bridge.send("VKWebAppCallAPIMethod", {
        method: "groups.getById",
        request_id: "gameCoin_request_local_group",
        params: {
          group_ids: String(Math.abs(ratingData.myGroup.id)),
          v: "5.131",
          access_token: token,
        },
      });
      const groupInfo = groupinfo.response[0];
      return setLocalRating((p) => ({
        ...p,
        myGroup: groupInfo,
      }));
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
                {view &&
                  activeTab === 1 &&
                  localRating.groups.map((v, i) => (
                    <SimpleCell
                      key={i}
                      onClick={() =>
                        window.open(
                          "https://vk.com/public" + Math.abs(v.id),
                          "_blank"
                        )
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
                      {v.name ? v.name : `@public` + Math.abs(v.id)}
                    </SimpleCell>
                  ))}
                {view && activeTab === 1 && (
                  <SimpleCell
                    className="addMyGroup"
                    before={<Icon28AddCircleOutline />}
                    hasHover={false}
                    hasActive={false}
                    onClick={() => bridge.send("VKWebAppAddToCommunity")}
                  >
                    Добавить мою группу
                  </SimpleCell>
                )}
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
        {view &&
          activeTab === 1 &&
          Object.keys(ratingData.myGroup).length > 0 &&
          typeof ratingData.myGroup !== "boolean" && (
            <FixedLayout vertical="bottom" className="myTop">
              <SimpleCell
                onClick={() => console.log(typeof ratingData.myGroup)}
                before={
                  <Avatar
                    size={40}
                    src={localRating.myGroup && localRating.myGroup.photo_100}
                  />
                }
                description={
                  <div className="ratingSum">
                    <span>
                      {number_format(ratingData.myGroup.coins / 1000)}
                    </span>
                    <CoinIcon />
                  </div>
                }
                className="ratingBlock"
                indicator={
                  <span className="ratingPosition">
                    ~ {ratingData.myGroup.position} место
                  </span>
                }
                hasHover={false}
                hasActive={false}
              >
                {localRating.myGroup
                  ? localRating.myGroup.name
                  : "@public" + Math.abs(ratingData.myGroup.id)}
              </SimpleCell>
            </FixedLayout>
          )}
      </Panel>
    </View>
  );
};

export default RatingView;
