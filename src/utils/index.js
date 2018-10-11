/**
 * 一些工具方法
 */

let SIGN_REGEXP = /([yMdhsm])(\1*)/g;
let DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding (s, len) {
  len = len - (s + '').length;
  for (let i = 0; i < len; i++) {
    s = '0' + s;
  }
  return s;
}

const utils = {
  // 格式化日期
  formatDate: {
    format: function (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN;
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
        case 'y':
          return padding(date.getFullYear(), $0.length);
        case 'M':
          return padding(date.getMonth() + 1, $0.length);
        case 'd':
          return padding(date.getDate(), $0.length);
        case 'w':
          return date.getDay() + 1;
        case 'h':
          return padding(date.getHours(), $0.length);
        case 'm':
          return padding(date.getMinutes(), $0.length);
        case 's':
          return padding(date.getSeconds(), $0.length);
        }
      });
    },
    parse: function (dateString, pattern) {
      let matchs1 = pattern.match(SIGN_REGEXP);
      let matchs2 = dateString.match(/(\d)+/g);
      if (matchs1.length === matchs2.length) {
        let _date = new Date(1970, 0, 1);
        for (let i = 0; i < matchs1.length; i++) {
          let _int = parseInt(matchs2[i]);
          let sign = matchs1[i];
          switch (sign.charAt(0)) {
          case 'y':
            _date.setFullYear(_int);
            break;
          case 'M':
            _date.setMonth(_int - 1);
            break;
          case 'd':
            _date.setDate(_int);
            break;
          case 'h':
            _date.setHours(_int);
            break;
          case 'm':
            _date.setMinutes(_int);
            break;
          case 's':
            _date.setSeconds(_int);
            break;
          }
        }
        return _date;
      }
      return null;
    }
  },
  // 增加天数
  addDateByDay (date, days = 0) {
    let timestamp = date.getTime() +　days * 1000 * 60 * 60 * 24
    return new Date(utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd 00:00:00'))
  },
  // 增加小时
  addDateByHour (date, hours = 0) {
    let timestamp = date.getTime() + hours * 1000 * 60 * 60
    return new Date(utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd hh:00:00'))
  },
  // 两个日期相差多少天
  getHowManyDays (date1 = new Date(), date2 = new Date()) {
    return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
  },
  // 根据时间戳转换为 时:分:秒
  getBootTime (timestamp) {
    if (!timestamp) {
        return '00:00:00'
      } else {
        let zero = (n) => { return n >= 10 ? n : '0' + n }
        let h = zero(Math.floor(timestamp / 1000 / 3600))
        let m = zero(Math.floor((timestamp / 1000 - h * 3600) / 60))
        let s = zero(Math.floor(timestamp / 1000 - h * 3600 - m * 60))
        return (`${h}:${m}:${s}`)
    }
  },
  //生成随机字符串
  createUniqueStr () {
    let s = [],
      hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i += 1) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
  },
  
  //时间戳转 年-月-日 时:分:秒
  timestampToDate (time) {
    let date = new Date(time);
    let Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      h = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
    M = (M < 10 ? `0${M}` : M);
    h = (h < 10 ? `0${h}` : h);
    m = (m < 10 ? `0${m}` : m);
    s = (s < 10 ? `0${s}` : s);
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
  },
  //倒计时:cb: 回调，接收剩余秒数,s: 总秒数
  countDown (cb, s) {
    let timer = setInterval(() => {
      s === 0 ? clearInterval(timer) : --s;
      cb(s);
    }, 1000);
  },
  //深拷贝
  deepCopy (obj1, obj2) {
    let isArray;
    let data;
    if (typeof obj1 === "object") {
      isArray = obj1.constructor === Array;
      data = isArray ? obj1.entries() : Object.entries(obj1);

      if (!obj2) obj2 = isArray ? [] : {};

      for (let [key, value] of data) {
        if (value && typeof value === "object" && !key.includes('_el')) {
          obj2[key] = (value.constructor === Array) ? [] : {};
          this.deepCopy(value, obj2[key]);
        } else {
          obj2[key] = value;
        }
      }
    } else {
      obj2 = obj1;
    }
    return obj2;
  },
  // 设置存储
  setQuery (key, value) {
    if (process.server) return
    const data = JSON.stringify(value).replace(/\,/g, '@_@')
    window.localStorage.setItem(key, encodeURI(data))
  },
  // 获取存储
  getQuery (key) {
    const data = window.localStorage.getItem(key)
    return data ? JSON.parse(decodeURI(data).replace(/\@\_\@/g, ',')) : false
  },
  // 加
  add (a, b) {
    let c, d, e;
    try {
      c = a.toString().split('.')[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split('.')[1].length;
    } catch (f) {
      d = 0;
    }
    e = Math.pow(10, Math.max(c, d))
    return (utils.mul(a, e) + utils.mul(b, e)) / e
  },
  // 减
  sub (a, b) {
    let c, d, e;
    try {
      c = a.toString().split('.')[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split('.')[1].length;
    } catch (f) {
      d = 0;
    }
    e = Math.pow(10, Math.max(c, d))
    return (utils.mul(a, e) - utils.mul(b, e)) / e
  },
  // 乘
  mul (a, b) {
    let c = 0
    let d = a.toString()
    let e = b.toString()
    try {
      c += d.split('.')[1].length;
    } catch (f) {
    }
    try {
      c += e.split('.')[1].length;
    } catch (f) {
    }
    return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
  },
  // 除
  div (a, b) {
    let c, d
    let e = 0
    let f = 0
    try {
      e = a.toString().split('.')[1].length;
    } catch (g) {
    }
    try {
      f = b.toString().split('.')[1].length;
    } catch (g) {
    }
    c = Number(a.toString().replace('.', ''))
    d = Number(b.toString().replace('.', ''))
    return utils.mul(c / d, Math.pow(10, f - e))
  },
  // 获取分页索引
  getHeadNumAdapter (page = 1, pageSize = 0, index = 0) {
    return utils.mul(pageSize, page - 1) + index + 1
  },
  // 下载文件
  downloadFile (url) {
    let form = document.createElement('form')
    form.style.display = 'none'
    form.setAttribute('target', '')
    form.setAttribute('method', 'post')
    form.setAttribute('action', url)
    let input = document.createElement('input')
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', 'exportData')
    input.setAttribute('value', (new Date()).getMilliseconds())
    document.body.appendChild(form)
    form.appendChild(input)
    form.submit()
  },
  // 保存参数到url
  saveToUrl (json) {
    let str = ''
    Object.entries(json).forEach(([key, value]) => {
      if (value) {
        str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&'
      }
    })
    // 出去最后一个 & 符号
    str = str.substr(0, str.length - 1)
    // 原url已经有参数了
    let hash = ''
    if (location.hash.indexOf('?') > -1) {
      let index = location.hash.indexOf('?')
      hash = location.hash.substr(0, index)
    } else {
      hash = location.hash
    }
    location.replace(hash + '?' + str)
  }
}

export default utils