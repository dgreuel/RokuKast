import * as React from "react";
import { useState } from "react";
import { sendToRoku as sendToRoku } from "../shared/roku";
import { IVideo } from "../shared/video";
import { getVideos } from "../shared/videoManager";
import "./Popup.scss";

export const Popup = () => {
  const [filteredVideos, setFilteredVideos] = useState([]);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    setFilteredVideos(getVideos(tabs[0].id));
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
