import request from 'supertest';
import app from '../app';

test('Home works', async () => {
  const response = await request(app.callback()).get('/');
  expect(response.status).toBe(200);

  const json = response.body;
  expect(json).toHaveProperty('application');
  expect(json.application).toBe('checkcredentials');
});
