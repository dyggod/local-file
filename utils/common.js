/**
 * 返回更可读的文件大小
 * @param {number} size - 文件大小
 */
function getReadableFileSizeString(size) {
  let unit = 'B';
  if (size > 1024) {
    size = size / 1024;
    unit = 'KB';
  }
  if (size > 1024) {
    size = size / 1024;
    unit = 'MB';
  }
  if (size > 1024) {
    size = size / 1024;
    unit = 'GB';
  }
  return size.toFixed(2) + unit;
}

module.exports = {
  getReadableFileSizeString,
};
