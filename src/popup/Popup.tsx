import * as _ from "lodash";
import * as React from "react";
import { useState } from "react";
import { sendToRoku as sendToRoku } from "./roku";
import { IVideo } from "../video";
import "./Popup.scss";

// tslint:disable-next-line: no-empty-interface
interface IAppProps {}

export const Popup = (props: IAppProps) => {
  const [filteredVideos, setFilteredVideos] = useState([]);
  const videos = JSON.parse(localStorage.getItem("videos"));
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabId = tabs[0].id;
    setFilteredVideos(
      _.sortBy(videos, (vid) => vid.timeStamp * -1).filter((video: IVideo) => {
        return video.tabId === currentTabId;
      }),
    );
  });
  return (
    <>
      <div className="popupContainer">
        <h3>Detected media:</h3>
        <ul>
          {filteredVideos
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
            : null}
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
};
