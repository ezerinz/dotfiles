function switchArray(arr) {
  var temp = arr[0];
  arr[0] = arr[1];
  arr[1] = temp;

  temp = arr[2];
  arr[2] = arr[3];
  arr[3] = temp;

  return arr;
}

// Example usage:
var arrayToSwitch = ["4px", "2px", "1px", "2px"];
var switchedArray = switchArray(arrayToSwitch);
console.log(switchedArray); // Output: ["2px", "1px", "1px", "2px"]
