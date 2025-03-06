const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201);

    const task = await Task.findById(response.body.task._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
});

test('Should not delete other users tasks', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);
    
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});

test('Should fetch task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.task._id).toEqual(taskOne._id.toString());
});

test('Should not fetch non-existent task', async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404);
});

test('Should update task', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(200);
    
    const task = await Task.findById(taskOne._id);
    expect(task.description).toEqual('From my test');
});