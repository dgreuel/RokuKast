import { IVideo } from "./video";
const videos: IVideo[] = [];

setInterval(() => {
  const iframes = Array.from(document.getElementsByTagName("iframe"));
  for (const iframe of iframes) {
    try {
      if (iframe.contentDocument || iframe.contentWindow.document) {
        const innerDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        const videoTags = Array.from(innerDoc.getElementsByTagName("video"));
        for (const tag of videoTags) {
          const videoUrl = tag.src;
          // tslint:disable-next-line: no-console
          console.log(`Video tag detected: ${videoUrl}`);

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
              chrome.runtime.sendMessage({ type: "add-video", video });
            }
          }
        }
      }
      // tslint:disable-next-line: no-empty
    } catch (e) {}
  }
}, 5000);
