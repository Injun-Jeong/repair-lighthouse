const express = require('express');
const repairLighthouseSvc = require('./svc/repairLighthouse.svc');
const router = express.Router();

// 백테스팅 호출
router.post('/backtesting', repairLighthouseSvc.backtesting);

module.exports = router;