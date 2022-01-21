import {
  Avatar,
  Panel,
  PanelHeader,
  PanelHeaderContent,
  View,
} from "@vkontakte/vkui";
import { useSelector } from "react-redux";

const MainView = ({ id }) => {
  const userData = useSelector((s) => s.user);
  return (
    <View id={id} activePanel="mainView--panel_main">
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
      </Panel>
    </View>
  );
};

export default MainView;
