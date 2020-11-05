import Event from './event';
import { IVideo } from "./video";

function handleVideoElement(videoElement: HTMLVideoElement) {
  const videoUrl = videoElement.src;
  console.log(`video element detected: ${videoUrl}`);
  if (videoUrl.indexOf("blob:") === -1) {
    // tslint:disable-next-line: no-console
    const video: IVideo = {
      detectionMethod: "video tag",
      title: document.title.substring(
        0,
        document.title.length < 100 ? document.title.length : 99,
      ),
      url: videoUrl,
      timeStamp: 0,
    };
    if (!!video.url && !!video.title) {
      chrome.runtime.sendMessage({ type: Event.ADD_VIDEO, video });
    }
  }
}

function handleIframeElement(iframe: HTMLIFrameElement) {
  try {
    if(iframe.src) {
      console.log(`iframe detected: ${iframe.src}`);
    }
    chrome.runtime.sendMessage({ type: Event.IFRAME, src: iframe.src });
    try{ 
      //this can throw?
      if (iframe.contentDocument) handleDocument(iframe.contentDocument);
    }catch(e) {
      console.error(e);
    }
    try{ 
      //this can maybe also throw?
      if(iframe.contentWindow.document) handleDocument(iframe.contentWindow.document);
    }catch(e) {
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  }
}

function handleDocument(document: Document) {
  try{
    const iframes: HTMLIFrameElement[] = Array.from(document.getElementsByTagName("iframe"));
    const videoElements: HTMLVideoElement[] = Array.from(document.getElementsByTagName("video"));
    for (const iframe of iframes) {
      handleIframeElement(iframe);
    }
    for (const videoElement of videoElements) {
      handleVideoElement(videoElement);
    }
  }catch(e) {
    console.error("Failed to handle document: " + e);
  }
}

/**
 * This appears to be checking the page for anything that might be playing a video.
 * Is it even running????
 */
setInterval(() => {
  handleDocument(document);
}, 5000);
