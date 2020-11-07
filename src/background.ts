import * as _ from "lodash";
import Event from './shared/event';
import { IVideo } from "./shared/video";
let videos: IVideo[] = [];

/**
 * Attempt to detect media requests.
 */
chrome.webRequest.onBeforeRequest.addListener(
  (info) => {
    if (
      info.url.endsWith(".ts") || // don't capture transport stream files (chunks)
      info.url.match(/input\/15985/) || // don't capture requests to Roku
      !info.url.match(/\.(m3u)|(mp4)/) // only look for valid video formats
    ) {
      // console.log("NAW dude! " + info.url)
      return { redirectUrl: info.url };
    }

    // tslint:disable-next-line: no-console
    // console.log(`Media request detected: ${info.url}`);

    const tabId = info.tabId;
    if (tabId > 0) {
      chrome.tabs.get(tabId, (tab) => {
        let title = tab.title;
        if (!title) {
          title = info.url.split("/").pop();
        }

        const video = {
          tabId,
          title,
          detectionMethod: "media request",
          url: info.url,
          timeStamp: info.timeStamp,
        };
        videos.unshift(video);
        videos = _.uniqBy(
          videos,
          (vid) => vid.url === info.url && vid.detectionMethod === "media request",
        );
        localStorage.setItem("videos", JSON.stringify(videos));
      });
    }

    return { redirectUrl: info.url };
  },
  // filters
  {
    urls: ["http://*/*", "https://*/*"],
    types: ["media", "xmlhttprequest"],
  },
  // extraInfoSpec
  [],
);

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === Event.ADD_VIDEO) {
    {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        const tabId = tabs[0].id;
        const video: IVideo = {
          url: message.video.url,
          title: message.video.title,
          detectionMethod: message.video.detectionMethod,
          tabId,
          timeStamp: message.video.timeStamp,
        };
        videos.unshift(video);
        videos = _.uniqBy(
          videos,
          (vid) =>
            vid.url === message.video.url &&
            vid.detectionMethod === message.video.detectionMethod,
        );
        localStorage.setItem("videos", JSON.stringify(videos));
      });
    }
  } else if (message.type === Event.IFRAME) {
    console.log("iframe found: " + message.src);
  }
});
