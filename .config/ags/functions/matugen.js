export const matugenStringify = (format, json) => {
  let result = "";

  for (let key in json) {
    let value = json[key];
    result += format.replace("{{key}}", key).replace("{{value}}", value) + "\n";
  }

  return result;
};
