
// 时间戳转时间 2014-06-18 10:33:24
export function timestampToTime(timestamp: any, type?: string) {
  const date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() + ' ';
  const h = date.getHours() + ':';
  const m = date.getMinutes() + ':';
  const s = date.getSeconds();
  if (type === 'ymd') {
    return (Y + M + D).replace(/(^\s*)|(\s*$)/g, '');
  }
  return Y + M + D + h + m + s;
}

