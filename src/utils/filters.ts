import { accDiv } from './global'
export function parseTime(time, format) {
  if (typeof time === 'number') {
    time = time || new Date()
  } else {
    if (time) {
      time = time.replace(/-/g, '/')
      const length = time.split('/').length || 0
      if (length === 2) {
        time = time + '/01'
      }
      time = Math.round(new Date(time).getTime() / 1000)
    } else {
      time = new Date()
    }
  }
  format = format || '{y}-{m}-{d} {h}:{i}'
  let date
  if (time instanceof Date) {
    date = time
  } else {
    if (String(time).length === 10) time *= 1000
    date = new Date(parseInt(time) || 0)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function parseDuring(e) {
  function pad(s) {
    return s < 10 ? '0' + s : s
  }
  var hours = parseInt(e / (1000 * 60 * 60))
  var minutes = parseInt((e % (1000 * 60 * 60)) / (1000 * 60))
  var seconds = parseInt((e % (1000 * 60)) / 1000)
  var str =
    pad(hours) +
    ' : ' +
    pad(minutes) +
    ' : ' +
    pad(seconds)
  return str
}

export function parseMoney(e) {
  e = +e || 0
  let flag = false
  if (e < 0) {
    flag = true
    e = -e
  }
  e = e < 10 ? '0' + e : String(e)
  const arr = e.split('').reverse()
  let tmp = []
  arr.forEach((item, index, arr) => {
    tmp.push(item)
    if (index === 1) {
      tmp.push('.')
      if (index === arr.length - 1) {
        tmp.push('0')
      }
    } else if ((index - 1) % 3 === 0 && index !== arr.length - 1 && arr[index + 1] !== '-') {
      tmp.push(',')
    }
  })
  if (Number(tmp[0]) === 0 && Number(tmp[1]) === 0) {
    tmp = tmp.slice(3)
  } else if (Number(tmp[0]) === 0 && tmp[2] === '.') {
    tmp = tmp.slice(1)
  }
  let res = tmp.reverse().join('')
  if (flag) {
    res = '-' + res
  }
  return res
}

export function parseEducationUser(e) {
  e = Number(e)
  switch(e) {
    case 0 : return '中专';
    case 1 : return '高中';
    case 2 : return '大专';
    case 3 : return '本科';
    case 4 : return '硕士及以上';
    case 5 : return '其他';
    default: return '中专';
  }
}

export function parseWorkExp(e) {
  e = Number(e)
  switch(e) {
    case 0 : return '1年以下工作经验';
    case 1 : return '1年以上工作经验';
    case 2 : return '2年以上工作经验';
    case 3 : return '3年以上工作经验';
    case 4 : return '5年以上工作经验';
    default: return '1年以下工作经验';
  }
}

export function parseJobSeekingStatus(e) {
  e = Number(e)
  switch(e) {
    case 0 : return '在职-暂不考虑';
    case 1 : return '离职-随时到岗';
    case 2 : return '在职-考虑机会';
    default: return '暂未设置';
  }
}

export function parseMoneyToK(e) {
  e = Number(e)
  e = accDiv(e, 1000) + 'k'
  return e
}

// 众包任务-任务类型
export function parseTaskType(e) {
  e = Number(e)
  switch(e) {
    case 0 : return '技术服务';
    case 1 : return '市场推广';
    // case 2 : return '技术任务';
    case 9 : return '其他';
    default: return `未知${e}`;
  }
}