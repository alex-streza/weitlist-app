const waitlistContainer = document.getElementById("waitlist-container");

if (!waitlistContainer) {
  throw new Error("Could not find waitlist container");
}

const waitlistId = waitlistContainer.getAttribute("data-key-id");
const width = waitlistContainer.getAttribute("data-width") ?? "100%";
const height = waitlistContainer.getAttribute("data-height") ?? "200px";

const iframe = document.createElement("iframe");
const waitlistFormURL = "http://localhost:3000/w/" + waitlistId;
iframe.src = waitlistFormURL;
iframe.width = width;
iframe.height = height;

waitlistContainer.appendChild(iframe);
