import WebRequestListener from './requestListener';
import Event from '../shared/event';
import { IVideo } from "../shared/video";
import VideoManager from '../shared/videoManager';

chrome.browserAction.setBadgeBackgroundColor({ color: "#4281F4" })

function updateBadge(tabId: number, videos: IVideo[]) {
  chrome.browserAction.setBadgeText({
    text: videos.length ? videos.length + "" : ""
  });
}

chrome.tabs.onCreated.addListener(function (tab: chrome.tabs.Tab) {
  VideoManager.onTabChanges(tab.id, (videos: IVideo[]) => {
    updateBadge(tab.id, videos);
  })
})
chrome.tabs.onActivated.addListener(function (activeInfo) {
  VideoManager.getVideos(activeInfo.tabId, (videos: IVideo[]) => {
    updateBadge(activeInfo.tabId, videos);
  });
});

/**
 * Attempt to detect media requests.
 */
const webRequestListener = new WebRequestListener();
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
        timestamp: new Date().getTime(),
        tabId: sender.tab ? sender.tab.id : undefined
      };
      VideoManager.pushVideo(video);
    }
  }
  return true;
});
