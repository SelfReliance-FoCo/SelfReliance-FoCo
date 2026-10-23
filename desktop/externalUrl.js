const ALLOWED_PROTOCOLS = new Set(['https:', 'tel:', 'mailto:']);

/** True when the desktop shell may hand this URL to the operating system. */
function isAllowedExternalUrl(url) {
  try {
    return ALLOWED_PROTOCOLS.has(new URL(url).protocol);
  } catch {
    return false;
  }
}

module.exports = { isAllowedExternalUrl };
