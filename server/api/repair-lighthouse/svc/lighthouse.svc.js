const request = require('sync-request');
const key = require('../../../../env/key.json');

let lighthouseResult = [];

/* db라고 이름 붙이기 민망할 정도,,, */
let db = [];
let volDB = [];

/* 단기 변화율 */
let change_price_rate_a_minute = 0.00;
let change_price_rate_three_minute = 0.00;
let change_price_rate_five_minute = 0.00;
let change_price_rate_seven_minute = 0.00;
let change_price_rate_ten_minute = 0.00;

/* 단기 평균 금액 */
let avg_price_a_minute = 0;
let avg_price_five_minute = 0;
let avg_price_ten_minute = 0;

/* 거래량 */
let last_five_minute_avg_trade_volume = 0;  // 최근 5분 간 평균 거래량
let last_ten_minute_avg_trade_volume = 0;   // 최근 10분 평균 거래량


const callLighthouse = async function (candle, basisJSON) {
    const address = key["server ip address"];
    const port = key["lighthouse port"];
    const url = address.concat(":").concat(port).concat("/lighthouse");

    let candle_date_time_kst = candle.candle_date_time_kst.split("T")[1].split(":");

    let bodyJSON = {
        market: 'KRW-XRP',
        trade_time_kst: candle_date_time_kst[0].concat(candle_date_time_kst[1]).concat(candle_date_time_kst[2]),
        opening_price: candle.opening_price,
        high_price: candle.high_price,
        low_price: candle.low_price,
        trade_price: candle.trade_price,
        acc_trade_volume: candle.candle_acc_trade_volume,
    }

    await calcRate(candle.trade_price, candle.candle_acc_trade_volume);

    const lighthouseJSON = {
        "telegramYn": "N",
        "basisJSON": {
            "market": basisJSON.market,
            "trade_volume_basis_value": basisJSON.trade_volume_basis_value,
            "change_price_rate_negative_basis_value": basisJSON.change_price_rate_negative_basis_value,
            "change_price_rate_positive_basis_value": basisJSON.change_price_rate_positive_basis_value,
            "downward_change_price_rate_a_minute_basis_value": basisJSON.downward_change_price_rate_a_minute_basis_value,
            "downward_last_five_minute_avg_trade_volume_basis_value": basisJSON.downward_last_five_minute_avg_trade_volume_basis_value,
            "downward_last_ten_minute_avg_trade_volume_basis_value": basisJSON.downward_last_ten_minute_avg_trade_volume_basis_value,
            "upward_change_price_rate_a_minute_basis_value": basisJSON.upward_change_price_rate_a_minute_basis_value,
            "upward_last_five_minute_avg_trade_volume_basis_value": basisJSON.upward_last_five_minute_avg_trade_volume_basis_value,
            "upward_last_ten_minute_avg_trade_volume_basis_value": basisJSON.upward_last_ten_minute_avg_trade_volume_basis_value
        },

        bodyJSON: bodyJSON,

        "change_price_rate_a_minute": change_price_rate_a_minute.toFixed(2),
        "change_price_rate_three_minute": change_price_rate_three_minute.toFixed(2),
        "change_price_rate_five_minute": change_price_rate_five_minute.toFixed(2),
        "change_price_rate_seven_minute": change_price_rate_seven_minute.toFixed(2),
        "change_price_rate_ten_minute": change_price_rate_ten_minute.toFixed(2),

        "avg_price_five_minute_rate": ((candle.trade_price - avg_price_five_minute).toFixed(2) / avg_price_five_minute * 100).toFixed(2),
        "avg_price_ten_minute_rate": ((candle.trade_price - avg_price_ten_minute).toFixed(2) / avg_price_ten_minute * 100).toFixed(2),

        "last_five_minute_avg_trade_volume": last_five_minute_avg_trade_volume.toFixed(0),
        "last_ten_minute_avg_trade_volume": last_ten_minute_avg_trade_volume.toFixed(0),

        "trade_volume": volDB[0].toFixed(0),
        "trade_price": (avg_price_a_minute.toFixed(0) * volDB[0].toFixed(0)).toFixed(0)
    };

    let res = request('POST', url, {
        json: lighthouseJSON,
    });

    return JSON.parse(res.body);
}


const calcRate = function (trade_price, acc_trade_volume) {
    /* calculate change rate */
    change_price_rate_a_minute = 0;
    change_price_rate_three_minute = 0;
    change_price_rate_five_minute = 0;
    change_price_rate_seven_minute = 0;
    change_price_rate_ten_minute = 0;

    /* calculate the average of price */
    avg_price_a_minute = 0;
    avg_price_five_minute = 0;
    avg_price_ten_minute = 0;

    /* update db */
    db[10] = db[9];
    avg_price_ten_minute += db[10];

    db[9] = db[8];
    avg_price_ten_minute += db[9];

    db[8] = db[7];
    avg_price_ten_minute += db[8];

    db[7] = db[6];
    avg_price_ten_minute += db[7];

    db[6] = db[5];
    avg_price_ten_minute += db[6];

    db[5] = db[4];
    avg_price_ten_minute += db[5];
    avg_price_five_minute += db[5];

    db[4] = db[3];
    avg_price_ten_minute += db[4];
    avg_price_five_minute += db[4];

    db[3] = db[2];
    avg_price_ten_minute += db[3];
    avg_price_five_minute += db[3];

    db[2] = db[1];
    avg_price_ten_minute += db[2];
    avg_price_five_minute += db[2];

    db[1] = db[0];
    avg_price_ten_minute += db[1];
    avg_price_five_minute += db[1];
    avg_price_a_minute += db[1];

    db[0] = trade_price;
    avg_price_a_minute += db[0];

    avg_price_ten_minute /= 10;
    avg_price_five_minute /= 5;
    avg_price_a_minute /= 2;


    if (!Number.isNaN(db[1])) {
        let val = db[0] - db[1];
        change_price_rate_a_minute = val == 0 ? 0.00 : (val / db[1]) * 100;
    }

    if (!Number.isNaN(db[3])) {
        let val = db[0] - db[3];
        change_price_rate_three_minute = val == 0 ? 0.00 : (val / db[3]) * 100;
    }

    if (!Number.isNaN(db[5])) {
        let val = db[0] - db[5];
        change_price_rate_five_minute = val == 0 ? 0.00 : (val / db[5]) * 100;
    }

    if (!Number.isNaN(db[7])) {
        let val = db[0] - db[7];
        change_price_rate_seven_minute = val == 0 ? 0.00 : (val / db[7]) * 100;
    }

    if (!Number.isNaN(db[10])) {
        let val = db[0] - db[10];
        change_price_rate_ten_minute = val == 0 ? 0.00 : (val / db[10]) * 100;
    }


    /* update the db of volume */
    last_five_minute_avg_trade_volume = 0;
    last_ten_minute_avg_trade_volume = 0;

    volDB[10] = volDB[9];
    last_ten_minute_avg_trade_volume += volDB[10];

    volDB[9] = volDB[8];
    last_ten_minute_avg_trade_volume += volDB[9];

    volDB[8] = volDB[7];
    last_ten_minute_avg_trade_volume += volDB[8];

    volDB[7] = volDB[6];
    last_ten_minute_avg_trade_volume += volDB[7];

    volDB[6] = volDB[5];
    last_ten_minute_avg_trade_volume += volDB[6];

    volDB[5] = volDB[4];
    last_ten_minute_avg_trade_volume += volDB[5];
    last_five_minute_avg_trade_volume += volDB[5];

    volDB[4] = volDB[3];
    last_ten_minute_avg_trade_volume += volDB[4];
    last_five_minute_avg_trade_volume += volDB[4];

    volDB[3] = volDB[2];
    last_ten_minute_avg_trade_volume += volDB[3];
    last_five_minute_avg_trade_volume += volDB[3];

    volDB[2] = volDB[1];
    last_ten_minute_avg_trade_volume += volDB[2];
    last_five_minute_avg_trade_volume += volDB[2];

    volDB[1] = volDB[0];
    last_ten_minute_avg_trade_volume += volDB[1];
    last_five_minute_avg_trade_volume += volDB[1];

    volDB[0] = acc_trade_volume;

    /* update avg trade volume */
    last_five_minute_avg_trade_volume /= 5;
    last_ten_minute_avg_trade_volume /= 10;
}


module.exports = {callLighthouse}