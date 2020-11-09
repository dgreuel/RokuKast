import WebRequestListener from './requestListener';
import Event from '../shared/event';
import { IVideo } from "../shared/video";
import VideoManager from '../shared/videoManager';

const webRequestListener = new WebRequestListener();

chrome.browserAction.setBadgeBackgroundColor({ color: "#4281F4" })

chrome.tabs.onCreated.addListener(function (tab: chrome.tabs.Tab) {
  VideoManager.onTabChanges(tab.id, (videos: IVideo[]) => {
    chrome.browserAction.setBadgeText({
      text: videos.length ? videos.length + "" : ""
    });
  })
})
chrome.tabs.onActivated.addListener(function (activeInfo) {
  VideoManager.getVideos(activeInfo.tabId, (videos: IVideo[]) => {
    chrome.browserAction.setBadgeText({
      text: videos.length ? videos.length + "" : ""
    });
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
      VideoManager.pushVideo(video);
    }
  }
  return true;
});
