import { useSelector } from "react-redux";
import { View, Panel, PanelHeader, Placeholder, Button } from "@vkontakte/vkui";
import { Icon56ErrorOutline } from "@vkontakte/icons";

const ErrorView = ({ id, back }) => {
  const errorData = useSelector((s) => s.user.errorData);
  const reInit = () => {
    back();
  };
  return (
    <View activePanel="errorView--panel_main" id={id}>
      <Panel id="errorView--panel_main">
        <PanelHeader separator={false} />
        <Placeholder
          icon={<Icon56ErrorOutline style={{ color: "#ef5350" }} />}
          header={"Ошибка"}
          action={
            <Button size="l" mode="tertiary" onClick={() => reInit()}>
              Повторить попытку
            </Button>
          }
          stretched
        >
          {errorData?.error_public}
        </Placeholder>
      </Panel>
    </View>
  );
};

export default ErrorView;
