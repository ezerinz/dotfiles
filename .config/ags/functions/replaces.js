export function replacePlaceholders(str, data) {
  if (typeof str !== "string") {
    return str;
  }
  return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
}

export function reverseReplace(str, data) {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      const regex = new RegExp(value, "g");
      str = str.replace(regex, `{{${key}}}`);
    }
  }
  return str;
}
