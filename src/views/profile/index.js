import {
  Panel,
  PanelHeader,
  PanelHeaderButton,
  PanelHeaderContent,
  Avatar,
  List,
  View
} from "@vkontakte/vkui";
import { Icon28ChevronBack } from "@vkontakte/icons";
import {
  CoinIcon,
  ProfileDevIcon,
  ProfileDonutsIcon,
  ProfileHistoryIcon,
  ProfileReferalIcon,
} from "../../lib/icons";
import { useSelector } from "react-redux";

const ProfileView = ({ id, back, history, mainPanel, onSwipeBack }) => {
  const userData = useSelector((s) => s.user.dbData);
  return (
    <View
      id={id}
      activePanel="profileView--panel_main"
      history={history}
      onSwipeBack={onSwipeBack}
    >
      <Panel id={mainPanel}>
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
          <PanelHeaderContent>Профиль</PanelHeaderContent>
        </PanelHeader>
        <div className="userInfo">
          <Avatar size={96} src={userData.vk?.photo_100} />
          <span className="name">
            {userData.vk?.first_name + " " + userData.vk?.last_name}
          </span>
        </div>
        <div className="menuContent">
          <div className="statistic">
            <div className="statistic--in">
              <div className="statistic--in__content">
                <span className="header">Заработано за все время:</span>
                <div className="coins">
                  <span className="count">0.000</span>
                  <CoinIcon />
                </div>
              </div>
            </div>
          </div>
          <div className="menu">
            <div className="statistic__mini">
              <div className="statistic__mini--block">
                <span className="header">Рейтинг</span>
                <span className="value">2</span>
              </div>
              <div className="statistic__mini--block">
                <span className="header">Улучшения</span>
                <span className="value">x0</span>
              </div>
              <div className="statistic__mini--block">
                <span className="header">Бонусы</span>
                <span className="value">x0</span>
              </div>
            </div>
            <List className="menuList">
              <div className="menuList--block">
                <ProfileHistoryIcon />
                <span className="menuList--block__content">
                  История переводов
                </span>
              </div>
              <div className="menuList--block">
                <ProfileDonutsIcon />
                <span className="menuList--block__content">Мои пончики</span>
              </div>
              <div className="menuList--block">
                <ProfileReferalIcon />
                <span className="menuList--block__content">
                  Пригласить друзей
                </span>
              </div>
              <div className="menuList--block">
                <ProfileDevIcon />
                <span className="menuList--block__content">
                  Для разработчиков
                </span>
              </div>
            </List>
          </div>
        </div>
      </Panel>
    </View>
  );
};

export default ProfileView;
