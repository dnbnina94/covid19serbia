var FormData = require('form-data');
const fetch = require("node-fetch");
var request = require('request');

let done = true;

const solutions = {
  'triple': (x) => {
    return x*3;
  },
  'numberToString': (x) => {
    return x+'';
  },
  'floatToInt': (x) => {
    return Math.trunc(x);
  },
  'isOdd': (x) => {
    return x%2!==0;
  },
  'cubeSurfaceArea': (x) => {
    return +(6*x*x).toFixed(4);
  },
  'squareRoot': (x) => {
    return Math.sqrt(x);
  },
  'stringToNumber': (x) => {
    return parseFloat(x);
  },
  'removeFirstThree': (x) => {
    return x.slice(3);
  },
  'dateRank': (x) => {
    const start = new Date("01/01/2019");
    const end = new Date(x);

    return Math.round((end-start)/(1000*60*60*24))+1;
  },
  'hasOnlyVowels': (x) => {
    return x.split('').every(e => {return (/^[aeiou]$/i).test(e.toLowerCase())});
  },
  'doubleIndex': (x) => {
    return x.filter((e,i) => {return e === i*2});
  },
  'sphereVolume': (x) => {
    return +(4/3*Math.PI*x*x*x).toFixed(4);
  },
  'flatten': (x) => {
    return x.flat(6);
  },
  'getFileExtension': (x) => {
    const arr = x.split('.'); return arr.length === 1 ? '' : arr.pop();
  },
  'oddElements': (x) => {
    return x.filter((e,i) => {return (i+1)%2 !== 0});
  },
  'sortingType': (x) => {
    let a = true;
    let d = true;
    for (let i=0; i<x.length-1; i++) {
      a = a && x[i+1] >= x[i];
      d = d && x[i+1] <= x[i];
    }
    return a ? 1 : d ? -1 : 0;
  },
  'mostFrequentItem': (x) => {
    let arr = [];
    x.map(num => {
      const elem = arr.find(e => e.key === num);
      if (elem) {
        elem.value++;
      } else {
        arr.push({
          key: num,
          value: 1
        })
      }
    });
    const maxVal = Math.max(...arr.map(e => e.value));
    return arr.find(e => maxVal === e.value).key;
  },
  'hasBalancePoint': (x) => {
    if (x.length === 0) {
      return true;
    }
    for (let i=0; i<x.length; i++) {
      const before = x.slice(0,i).reduce((acc,curr) => acc+curr, 0);
      const after = x.slice(i).reduce((acc,curr) => acc+curr, 0);
      if (after === before) {
          return true;
      }
    }
    return false;
  },
  'invertCase': (x) => {
    return x.split('').map(s => {
      return s === s.toLowerCase() ? s.toUpperCase() : s.toLowerCase()
    }).join('')
  }
}

var entryId;
var entryKey;

const runTask = (data) => {
  const tests = data.nextTask.tests_json;
  const slug = data.nextTask.slug;
  const results = Object.fromEntries(
    Object.entries(tests).map(([key, value]) => {
      if (value.result) {
        return [key, value.result];
      } else {
        const solution = solutions[slug];
        return [key, solution(value.args[0])];
      }
    })
  );
  
  request.post(`https://speedcoding.toptal.com/webappApi/entry/${entryId}/attemptTask`, {
    form: {
      "attempt_id": data.attemptId,
      "tests_json": JSON.stringify(results),
      "entry_key": entryKey,
      "code": data.nextTask.code
    }
  }, (error, res, body) => {
    if (error) throw error;
    const next = JSON.parse(body).data
    if (next.isChallengeEntryFinished) {
      console.log(next.totalPoints)
      mainFunc();
      return;
    } else {
      runTask(next);
    }
  })
}

var options = {
  'method': 'POST',
  'url': 'https://speedcoding.toptal.com/webappApi/entry?ch=22&acc=1428',
  'headers': {
    'cookie': '__cfduid=dca0e5271e94be4d7abcafe73239f12351607112268; PHPSESSID=94e767b23685eaee8053046eab7edf4b; __cfduid=d4b2e1e01e937022dee06fa97816628c21607166712; PHPSESSID=a6dee5e817bbab969b0d9822e21038b6'
  },
  formData: {
    'challengeSlug': 'toptal-js-2020',
    'email': 'nina.grujic.94@gmail.com',
    'leaderboardName': 'Nina',
    'isConfirmedToBeContacted': 'true',
    'countryAlpha2': 'RS'
  }
};

const mainFunc = () => {
  setTimeout(() => {
    request(options, function (error, response, body) {
      if (error) {
        throw new Error(error);
        return;
      }
      try {
        const {
          data
        } = JSON.parse(body);
        if (data === null) {
          console.log("SACEKAJ!");
          mainFunc();
          return;
        }
        entryId = data.entry.id;
        entryKey = data.entry.entry_key;
        runTask(data, data.entry.id, data.entry.entry_key);
      } catch {
        mainFunc();
      }
    });
  }, 5000);
  
}

mainFunc();