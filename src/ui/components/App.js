const React = require("react");
const ReactDOM = require("react-dom");
import { connect } from "react-redux";

import Toolbox from "./Toolbox";
import Tooltip from "./Tooltip";
import Comments from "./Comments";
import Header from "./Header";
import Recordings from "./Recordings/index";

import SplitBox from "devtools/client/shared/components/splitter/SplitBox";
import RightSidebar from "./RightSidebar";
import { actions } from "../actions";
import { selectors } from "../reducers";

import "styles.css";

function setTheme(theme) {
  document.body.parentElement.className = theme;
}

class App extends React.Component {
  state = {
    orientation: "bottom",
    tooltip: null,
  };

  componentDidMount() {
    const { theme } = this.props;
    setTheme(theme);
  }

  componentDidUpdate(prevProps) {
    const { theme } = this.props;
    if (theme !== prevProps.theme) {
      setTheme(theme);
    }
  }

  renderViewer(toolbox) {
    const { tooltip } = this.props;
    return (
      <div id="outer-viewer">
        <div id="viewer">
          <canvas id="graphics"></canvas>
          <div id="highlighter-root"></div>
        </div>
        <RightSidebar toolbox={toolbox} />
        <Tooltip tooltip={tooltip} />
      </div>
    );
  }

  render() {
    const {
      commentVisible,
      hideComments,
      updateTimelineDimensions,
      recordingId,
      loading,
    } = this.props;
    const { orientation } = this.state;
    const isLoading = loading < 100;

    if (isLoading) {
      return (
        <>
          <Header />
          {recordingId ? (
            <div className="loading-bar" style={{ width: `${loading}%` }} />
          ) : (
            <Recordings />
          )}
        </>
      );
    }

    const vert = orientation != "bottom";
    const toolbox = <Toolbox />;

    let startPanel, endPanel;
    if (orientation == "bottom" || orientation == "right") {
      startPanel = this.renderViewer(toolbox);
      endPanel = toolbox;
    } else {
      startPanel = toolbox;
      endPanel = this.renderViewer(toolbox);
    }

    return (
      <>
        <Header />
        <Comments />
        {commentVisible && <div className="app-mask" onClick={() => hideComments()} />}
        <SplitBox
          style={{ width: "100vw", overflow: "hidden" }}
          splitterSize={1}
          initialSize="50%"
          minSize="20%"
          maxSize="80%"
          vert={vert}
          onMove={num => updateTimelineDimensions()}
          startPanel={startPanel}
          endPanelControl={false}
          endPanel={endPanel}
        />
      </>
    );
  }
}

export default connect(
  state => ({
    theme: selectors.getTheme(state),
    tooltip: selectors.getTooltip(state),
    commentVisible: selectors.commentVisible(state),
    loading: selectors.getLoading(state),
    recordingId: selectors.getRecordingId(state),
    user: selectors.getUser(state),
  }),
  {
    updateTheme: actions.updateTheme,
    hideComments: actions.hideComments,
    updateTimelineDimensions: actions.updateTimelineDimensions,
  }
)(App);
