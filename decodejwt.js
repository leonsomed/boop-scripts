/**
    {
        "api":1,
        "name":"Decode JWT",
        "description":"Decodes a JWT.",
        "author":"Leonso Medina",
        "icon":"html",
        "tags":"jwt,decode"
    }
**/

// thanks to https://github.com/jsdom/abab/blob/master/lib/atob.js for the implementation

function atob(data) {
  data = `${data}`;
  data = data.replace(/[ \t\n\f\r]/g, "");
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }
  if (data.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(data)) {
    return null;
  }
  let output = "";
  let buffer = 0;
  let accumulatedBits = 0;
  for (let i = 0; i < data.length; i++) {
    buffer <<= 6;
    buffer |= atobLookup(data[i]);
    accumulatedBits += 6;
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 0xff0000) >> 16);
      output += String.fromCharCode((buffer & 0xff00) >> 8);
      output += String.fromCharCode(buffer & 0xff);
      buffer = accumulatedBits = 0;
    }
  }
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 0xff00) >> 8);
    output += String.fromCharCode(buffer & 0xff);
  }
  return output;
}

function atobLookup(chr) {
  if (/[A-Z]/.test(chr)) {
    return chr.charCodeAt(0) - "A".charCodeAt(0);
  }
  if (/[a-z]/.test(chr)) {
    return chr.charCodeAt(0) - "a".charCodeAt(0) + 26;
  }
  if (/[0-9]/.test(chr)) {
    return chr.charCodeAt(0) - "0".charCodeAt(0) + 52;
  }
  if (chr === "+") {
    return 62;
  }
  if (chr === "/") {
    return 63;
  }
  return undefined;
}

function main(state) {
    const text = state.fullText;
    const payload = text.split('.')[1];
    const decoded = atob(payload);
    state.fullText = JSON.stringify(JSON.parse(decoded), null, 4);
}
