import { useSelector } from "react-redux";
import { Panel, PanelHeader, Placeholder, Button, View } from "@vkontakte/vkui";
import { Icon56ErrorOutline } from "@vkontakte/icons";
import { PAGE_MAIN } from "@happysanta/router";

const ErrorView = ({ id, go, history, mainPanel, onSwipeBack }) => {
  const errorData = useSelector((s) => s.user.errorData);
  const reInit = () => {
    go(PAGE_MAIN);
  };
  return (
    <View
      activePanel="errorView--panel_main"
      id={id}
      history={history}
      onSwipeBack={onSwipeBack}
    >
      <Panel id={mainPanel}>
        <PanelHeader separator={false} />
        <Placeholder
          icon={<Icon56ErrorOutline style={{ color: "#ef5350" }} />}
          header={"Ошибка"}
          action={
            errorData?.showButton && (
              <Button size="l" mode="tertiary" onClick={() => reInit()}>
                Повторить попытку
              </Button>
            )
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
