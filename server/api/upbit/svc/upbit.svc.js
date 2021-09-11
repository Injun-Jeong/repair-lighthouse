const request = require('sync-request');
const url = 'https://api.upbit.com/v1/candles/minutes/1?';
const options = {method: 'GET', headers: {Accept: 'application/json'}};


/** 시세 분(minute)캔들 조회
 * getPrice
 * @param ticker
 * @returns { ... }
 */
const getMinuteCandle = function(data) {
    const market = data.market;                             // ex. KRW-XRP
    const last_candle_time = data.last_candle_time;         // ex. 2021-01-01 12:00:00
    const count = data.count;                               // ex. 200 (max: 200)
    const urlInfo = url.concat("market=").concat(market)
                        .concat("&to=").concat(last_candle_time)
                        .concat("&count=").concat(count);
    const response = request('GET', urlInfo, options);
    return JSON.parse(response.getBody().toString());
}


module.exports = { getMinuteCandle };