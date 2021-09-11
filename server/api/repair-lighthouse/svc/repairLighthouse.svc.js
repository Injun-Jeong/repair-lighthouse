



/** 백테스팅 수행
 * backtesting
 * @param req
 * @param res
 * @returns {*}
 */
const backtesting = function(req, res) {
    const bodyJSON = req.body;
    console.info(bodyJSON);


    /* 1. 업비트 분단위 캔들 조회 */



    /* 2. 순회: 모니터링 조회 ( lighthouse API 호출 )
    * @parm: 분단위 캔들 조회 결과값 기반 인자 값 세팅
    *   {
    *       "bodyJSON": {
    *           "market": "KRW-XRP",
    *           "trade_time_kst": "",
    *           "trade_price": 0,
    *           "signed_change_rate": "전일 대비",
    *           "opening_price": 0,
    *           "high_price": 0
    *       },
    *       "change_price_rate_a_minute": "최근 1분 간 가격 변화율",
    *       "change_price_rate_five_minute": "최근 5분 간 가격 변화율",
    *       "change_price_rate_ten_minute": "최근 10분 간 가격 변화율",
    *       "avg_price_five_minute_rate": "최근 5분 간 평균 가격 대비 시가 증감률",
    *       "avg_price_ten_minute_rate": "최근 10분 간 평균 가격 대비 시가 증감률",
    *       "trade_volume": "최근 거래량",
    *       "last_five_minute_avg_trade_volume": "최근 5분 간 평균 거래량",
    *       "last_ten_minute_avg_trade_volume": "최근 10분 간 평균 거래량"
    *   }
    * @return:
    *   {
    *       "detectYn": "",
    *       "cont": ""
    *   }
    */



    /* 3. 시뮬레이션
    * - detectYn 및 cont 기반, 매수/매도 시뮬레이션 수행
    *
    * @return:
    *   {
    *       "total_profit": "총 수익률",
    *       "trade_volume_basis_value": "거래량 특이점 기준 값",
    *       "change_price_rate_negative_basis_value": "가격 변화율 특이점 음의 기준 값",
    *       "change_price_rate_positive_basis_value": "가격 변화율 특이점 양의 기준 값",
    *       "downward_change_price_rate_a_minute_basis_value": "하방 최근 1분 간 가격 변화율 기준 값",
    *       "downward_last_five_minute_avg_trade_volume_basis_value": "하방 최근 5분 간 평균 거래량 기준 값",
    *       "downward_last_ten_minute_avg_trade_volume_basis_value": "하방 최근 10분 간 평균 거래량 기준 값",
    *       "upward_change_price_rate_a_minute_basis_value": "상방 최근 1분 간 가격 변화율 기준 값",
    *       "upward_last_five_minute_avg_trade_volume_basis_value": "상방 최근 5분 간 평균 거래량 기준 값",
    *       "upward_last_ten_minute_avg_trade_volume_basis_value": "상방 최근 10분 간 평균 거래량 기준 값"
    *   }
    */



    return res.send("백테스팅 호출");
};


/** todo: 고래탐지 모니터링 요소 값 변경 호출
 *
 */


module.exports = { backtesting };