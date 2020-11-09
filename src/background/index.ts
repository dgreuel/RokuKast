import WebRequestListener from './requestListener';
import Event from '../shared/event';
import { IVideo } from "../shared/video";
import VideoManager from '../shared/videoManager';

const videoManager = new VideoManager();
const webRequestListener = new WebRequestListener(videoManager);

chrome.browserAction.setBadgeBackgroundColor({ color: "#4281F4" })

chrome.tabs.onActivated.addListener(function (activeInfo) {
  const videos = videoManager.getVideos(activeInfo.tabId);
  chrome.browserAction.setBadgeText({
    text: videos.length ? videos.length + "" : ""
  });
});

/**
 * Attempt to detect media requests.
 */
chrome.webRequest.onBeforeRequest.addListener(
  (webRequest: chrome.webRequest.WebRequestBodyDetails) => {
    webRequestListener.listen(webRequest);
  },
  {
    urls: ["http://*/*", "https://*/*"],
    types: ["media", "xmlhttprequest"],
  },
  [],
);

/**
 * Listen for messages from running extension scripts.
 */
chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse) => {
  console.log(`message received: ${JSON.stringify(message)}`);
  if (message.type === Event.ADD_VIDEO) {
    {
      const video: IVideo = {
        url: message.video.url,
        title: message.video.title,
        detectionMethod: message.video.detectionMethod,
        tabId: sender.tab ? sender.tab.id : undefined
      };
      videoManager.pushVideo(video);
    }
  } else if (message.type === Event.GET_VIDEOS) {
    const videos = videoManager.getVideos(message.tabId);
    sendResponse({ videos: videos });
  } else if (message.type === Event.UPDATED_VIDEOS) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      const videos = videoManager.getVideos(activeTab.id)
      chrome.browserAction.setBadgeText({ text: videos.length + "" });
    });
  }
  return true;
});
