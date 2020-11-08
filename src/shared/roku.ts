interface RokuRequest {
  title: string;
  sentLink: string;
}

enum Format {
  HLS = "hls",
  MP4 = "mp4"
}

/**
 * Post the video request information to the Roku
 * @param rokuRequest video information
 * @param ip ip address of the roku
 * @param format the video format
 */
function sendXhrRequest(rokuRequest: RokuRequest, ip: string, format: Format) {
  const xhr = new XMLHttpRequest();
  xhr.open("HEAD", rokuRequest.sentLink, true);
  xhr.onload = () => {
    const u = encodeURIComponent(xhr.responseURL);
    const videoName = encodeURIComponent(rokuRequest.title);
    //not sure where this is documented, but would be good to know
    const url = `http://${ip}:8060/input/15985?t=v&u=${u}&videoName=${videoName}&videoFormat=${format}`;
    const request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send("");
  };
  xhr.send(null);
}

/**
 * Determine the format of the video.
 * TODO: understand this.
 * @param rokuRequest 
 */
function getVideoFormat(rokuRequest: RokuRequest): Format {
  let isHLS = rokuRequest.sentLink.indexOf("m3u") !== -1 || rokuRequest.sentLink.indexOf("hls-vod") !== -1;
  const isPlexStream = rokuRequest.sentLink.indexOf("&mediaIndex=0&partIndex=0&protocol=http") !== -1;

  if (isPlexStream) {
    rokuRequest.sentLink.replace(
      new RegExp("&mediaIndex=0&partIndex=0&protocol=http", "g"),
      "&mediaIndex=0&partIndex=0&protocol=hls",
    );
    isHLS = true;
  }
  return isHLS ? Format.HLS : Format.MP4;
}

/**
 * Sends a video request to the configured roku.
 */
export function sendToRoku(rokuRequest: RokuRequest) {
  // tslint:disable-next-line: no-console
  console.dir(rokuRequest);
  if (localStorage.ipAddress !== undefined) {
    const format: Format = getVideoFormat(rokuRequest);
    sendXhrRequest(rokuRequest, localStorage.ipAddress, format);
  } else {
    alert("Please set your roku ip in options page");
  }
}
