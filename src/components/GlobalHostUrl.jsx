export const getHostnamePart = () => {
    const fullURL = window.location.href;
    const url = new URL(fullURL);
    return url.hostname.split(".")[0];
  };
  