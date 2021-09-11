const express = require('express');
const repairLighthouse = require('./api/repair-lighthouse');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/repair-lighthouse', repairLighthouse);

app.get('/', (req, res) => {
    res.send('the main of repair lighthouse server');
});

app.listen(port, () => {
    console.log(`app listening at http://158.247.207.155:${port}`);
})

module.exports = app;