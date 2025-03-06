const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
app.use(userRouter);  
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is up on port ' + port);
}
);
