import React, { Component } from "react";
import { sendToRoku as sendToRoku } from "../shared/roku";
import { IVideo } from "../shared/video";
import VideoManager from "../shared/videoManager";
import "./Popup.scss";

type Props = {
  tabId: number
}

type State = {
  videosForTab: IVideo[]
}

export default class Popup extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      videosForTab: []
    }
    const that = this;
    VideoManager.getVideos(this.props.tabId, (videos: IVideo[]) => {
      that.setState({ videosForTab: videos });
    })
  }
  componentDidMount() {
    const that = this;
    VideoManager.onTabChanges(this.props.tabId, (videos: IVideo[]) => {
      that.setState({ videosForTab: videos });
    })
  }
  render() {
    const videosForTab = this.state.videosForTab;
    console.log(`making the popup for tab ${this.props.tabId}!`)
    return (
      <>
        <div className="popupContainer">
          <h3>Detected media:</h3>
          <ul>
            {(videosForTab && videosForTab.length > 0)
              ? videosForTab.map((video: IVideo, index) => (
                <li key={`${index}-row`}>
                  <span className="videoTitle" title={video.url}>
                    {video.title || "unknown"}
                  </span>
                  <span className="detectionMethod">
                    {video.detectionMethod}
                  </span>
                  <span>
                    <a
                      key={`${index}-download`}
                      href={video.url}
                      title="Download"
                      target="_blank"
                    >
                      <i className="material-icons">file_download</i>
                    </a>
                  </span>
                  <span>
                    <a
                      key={`${index}-cast`}
                      onClick={sendToRoku.bind(this, {
                        title: video.title,
                        sentLink: video.url,
                      })}
                      title="Cast"
                    >
                      <i className="material-icons">cast</i>
                    </a>
                  </span>
                </li>
              ))
              : (
                <li>
                  <span className="videoTitle">
                    None
                </span>
                </li>
              )}
          </ul>
        </div>
        <div className="toolbar">
          <span className="settings">
            <a href="options.html">
              <i className="material-icons">settings</i>
            </a>
          </span>
        </div>
      </>
    );
  }
}
