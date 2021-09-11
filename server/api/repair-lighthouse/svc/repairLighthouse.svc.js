const upbitSvc = require('../../upbit/svc/upbit.svc');
const lighthouseSvc = require('./lighthouse.svc');
let xrpDB = require('../../../db/xrp');
let lighthouseResult = [];

/** 백테스팅 수행
 * backtesting
 * @param req
 * @param res
 * @returns {*}
 */
const backtesting = async function(req, res) {
    const bodyJSON = req.body;

    /* 1. 업비트 분단위 캔들 조회 todo: 배치 프로그램으로 옮기자 */
    await getMinuteCandle(bodyJSON.market);


    /* 2. lighthouse API 호출 */
    lighthouseResult = [];
    for ( let idx = 0; idx < xrpDB.length ; idx++) {
        let rtn = await lighthouseSvc.callLighthouse(xrpDB[idx], bodyJSON);
        let rtnJSON = JSON.parse(rtn)

        let i = lighthouseResult.length;
        lighthouseResult[i] = {"candle": xrpDB[idx], "lighthouse": rtnJSON};
    }


    /* 3. 시뮬레이션 수행 */
    let wallet = await simulation();
    let the_rate_of_profit = ((wallet.balance - 10000000) / 100000).toFixed(2).concat(" %");

    let result = {
        "result": "백테스팅 결과",
        "wallet": wallet,
        "the_rate_of_profit": the_rate_of_profit
    }
    console.info("백테스팅 결과,,,,");
    console.info(result);

    return res.json(JSON.stringify(result));
};


const simulation = async function() {
    // 초기 자본 기본값: 1,000 만원      초기 물량: 0    평단가: 0
    let wallet = {
        "balance": 10000000,
        "amount": 0,
        "avg_price": 0
    }

    let cnt = 0;
    let trade_price = 0;
    let position = "short";

    for ( let idx = 0; idx < lighthouseResult.length; idx++ ) {
        if (lighthouseResult[idx].lighthouse.detectYn == "Y") {
            cnt++;
            console.info(cnt.toString() + "번째 감지");
            trade_price = lighthouseResult[idx].candle.trade_price;

            if (lighthouseResult[idx].lighthouse.cont.substr(1, 4) != "UW01"
                    && lighthouseResult[idx].lighthouse.cont.substr(1, 4) != "DW01") {
                console.info(lighthouseResult[idx].candle);
            }
        }
    }

    return wallet;
}


const transaction = function(wallet, trade_price, position) {
    let balance = wallet.balance;
    let amount = wallet.amount;

    if ( position == "long") {
        let newAmount = Number((balance / trade_price).toFixed(0));
        return wallet = {
            "balance": 0,
            "amount": newAmount
        };
    }
    else {
        let newBalance = Number((amount * trade_price).toFixed(0));
        return wallet = {
            "balance": newBalance,
            "amount": 0
        };
    }
}



const getMinuteCandle = async function(market) {
    // basis term: 2021. 04. 20. ~ 2021. 04. 27
    let date = new Date(2021, 3, 20);

    for (let day = 1; day <= 8; day++) {
        let dateInfo = date.toLocaleDateString().split("/");        // [월, 일, 년]
        let MM = dateInfo[0];
        if (MM.length == 1) {
            MM = "0".concat(MM);
        }
        let dd = dateInfo[1];
        if (dd.length == 1) {
            dd = "0".concat(dd);
        }
        let yyyy = dateInfo[2];
        let HH = 0;
        let strHH = "";

        for (let cnt = 0; cnt < 8; cnt++) {
            HH += 3;
            if (HH.toString().length == 1) {
                strHH = "0".concat(HH.toString());
            } else {
                strHH = HH.toString();
            }

            // format: yyyy-MM-dd HH:mm:ss
            let last_candle_time = yyyy.concat("-")
                                    .concat(MM).concat("-")
                                    .concat(dd).concat(" ")
                                    .concat(strHH).concat(":00:00");

            console.info("=== 시세 분캔들 조회: " + last_candle_time);

            let dataJSON = {
                "market": market,
                "last_candle_time": last_candle_time,
                "count": "180"
            }

            let candle = await upbitSvc.getMinuteCandle(dataJSON);
            await updateDB(candle);
        }

        await sleep(3000);
        date.setDate(date.getDate() + 1);       // 일 수 증가
    }
}

const updateDB = function(candle) {
    let idx = 0;
    for (let cnt = candle.length - 1; cnt >= 0; cnt--) {
        xrpDB[idx] = candle[cnt];
        idx++;
    }
}


const sleep = function(ms) {
    return new Promise(resolve=>{
        setTimeout(resolve,ms);
    })
}


/** todo: 고래탐지 모니터링 요소 값 변경 호출
 *
 */


module.exports = { backtesting };