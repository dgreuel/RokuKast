import React, { Component } from "react";
import { sendToRoku as sendToRoku } from "../shared/roku";
import { IVideo } from "../shared/video";
import Event from "../shared/event";
import "./Popup.scss";

type Props = {
  tabId: number
}

type State = {
  filteredVideos: IVideo[]
}

export default class Popup extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.handleMessage = this.handleMessage.bind(this);
    this.getVideos = this.getVideos.bind(this);
    this.newVideos = this.newVideos.bind(this);
    this.getVideos();
    this.state = {
      filteredVideos: []
    }
  }
  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.handleMessage);
  }
  private getVideos() {
    var that = this;
    chrome.runtime.sendMessage({ type: Event.GET_VIDEOS, tabId: this.props.tabId }, (message) => {
      that.newVideos(message.videos);
    });
  }
  newVideos(videos: IVideo[]) {
    console.log(`Retrieved ${videos.length} videos`);
    this.setState({ filteredVideos: videos });
  }
  handleMessage(msg) {
    if (msg.type === Event.UPDATED_VIDEOS) {
      this.getVideos();
    }
  }
  render() {
    const filteredVideos = this.state.filteredVideos;
    console.log(`making the popup for tab ${this.props.tabId}!`)
    return (
      <>
        <div className="popupContainer">
          <h3>Detected media:</h3>
          <ul>
            {(filteredVideos && filteredVideos.length > 0)
              ? filteredVideos.map((video: IVideo, index) => (
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
