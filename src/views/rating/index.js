import {
  Panel,
  PanelHeader,
  PanelHeaderContent,
  View,
  PanelHeaderButton,
  PullToRefresh,
  SimpleCell,
  List
} from "@vkontakte/vkui";
import { Icon28ChevronBack } from "@vkontakte/icons";
const RatingView = ({ id, back }) => {
  return (
    <View id={id} activePanel="ratingView--panel_main">
      <Panel id="ratingView--panel_main">
        <PanelHeader
          separator={false}
          left={
            <PanelHeaderButton onClick={() => back()} hasHover={false} hasActive={false}>
              <Icon28ChevronBack />
            </PanelHeaderButton>
          }
        >
          <PanelHeaderContent>Рейтинг</PanelHeaderContent>
        </PanelHeader>
        <PullToRefresh>
            <div className="mainRating">
                <div className="top3">

                </div>
                <div className="tabs">

                </div>
                <List>
                    <SimpleCell>

                    </SimpleCell>
                </List>
            </div>
        </PullToRefresh>
      </Panel>
    </View>
  );
};

export default RatingView;
