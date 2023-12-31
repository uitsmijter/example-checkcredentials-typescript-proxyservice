import request from 'supertest';
import app from '../app';
import { StatusCodes } from 'http-status-codes';
import { prismaMock } from '../singleton';
import prisma from '../client';
import {hash, hashSync} from "bcrypt";

test('Validate login without properties', async () => {
  prismaMock.users.create.mockImplementation();
  const response = await request(app.callback())
      .post('/validate-login')
      .send({ username: 'James' });

  expect(response.status).toBe(StatusCodes.NOT_ACCEPTABLE);
});

test('Validate login unknown user', async () => {
  prismaMock.users.create.mockImplementation();
  const response = await request(app.callback())
      .post('/validate-login')
      .send({ username: 'James', password: 'fake-password' });

  expect(response.status).toBe(StatusCodes.NOT_FOUND);
});

test('Validate login ok', async () => {
  prismaMock.users.create.mockImplementation();
  const bhash = hashSync('real-password', 10);
  const user = {
    name: 'James',
    password: bhash,
    email: 'james@example.com',
  };
  prismaMock.users.findFirst.mockResolvedValue({
    ...user,
    id: BigInt(1),
    email_verified_at: null,
    remember_token: null,
    created_at: null,
    updated_at: null,
  });

  const response = await request(app.callback())
      .post('/validate-login')
      .send({ username: 'james@example.com', password: 'real-password' });

  expect(response.status).toBe(StatusCodes.OK);
  expect(response.body).toHaveProperty('name');
  expect(response.body).not.toHaveProperty('password');
  expect(response.body.name).toBe('James');
});

test('Validate igor login', async () => {
  prismaMock.users.create.mockImplementation();
  const user = {
    name: 'Paula',
    password: '$2y$10$s3Q5LRVVLDHpujjik7121ORGGLtjR3zM4mKNSA0EJ7KG96YYKIcOy',
    email: 'paula@example.com',
  };
  prismaMock.users.findFirst.mockResolvedValue({
    ...user,
    id: BigInt(1),
    email_verified_at: null,
    remember_token: null,
    created_at: null,
    updated_at: null,
  });

  const response = await request(app.callback())
      .post('/validate-login')
      .send({ username: 'paula@example.com', password: 'another-password' });

  expect(response.status).toBe(StatusCodes.OK);
  expect(response.body).toHaveProperty('name');
  expect(response.body).not.toHaveProperty('password');
  expect(response.body.name).toBe('Paula');
});

test('Validate existence without properties', async () => {
  prismaMock.users.create.mockImplementation();
  const response = await request(app.callback())
      .post('/validate-user')
      .send({});

  expect(response.status).toBe(StatusCodes.NOT_ACCEPTABLE);
});

test('Validate existence of unknown user', async () => {
  prismaMock.users.create.mockImplementation();
  const response = await request(app.callback())
      .post('/validate-user')
      .send({ username: 'Jenette' });

  expect(response.status).toBe(StatusCodes.NOT_FOUND);
});

test('Validate existence ok', async () => {
  prismaMock.users.create.mockImplementation();

  const user = {
    name: 'James',
    password: 'real-password',
    email: 'james@example.com',
  };
  prismaMock.users.findFirst.mockResolvedValue({
    ...user,
    id: BigInt(1),
    email_verified_at: null,
    remember_token: null,
    created_at: null,
    updated_at: null,
  });

  const response = await request(app.callback())
      .post('/validate-user')
      .send({ username: 'james@example.com' });

  expect(response.status).toBe(StatusCodes.OK);
});
