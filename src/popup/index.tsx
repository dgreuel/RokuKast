import * as React from "react";
import * as ReactDOM from "react-dom";
import Popup from "./popup";

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tabId = tabs[0].id;
  ReactDOM.render(<Popup tabId={tabId} />, document.getElementById("popup"));
});
