import { Middleware } from 'koa';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
import { Credentials } from '../models/Credentials';
import prisma from '../client';
import {compare} from "bcrypt";

// Validates credentials of the user
export const validateLoginController: Middleware = async (ctx) => {
  const body: Credentials = ctx.request.body as Credentials;
  if (body.username === undefined || body.username.length <= 0
      || body.password === undefined || body.password.length <= 0) {
    ctx.throw(StatusCodes.NOT_ACCEPTABLE, 'missing credentials');
  }
  const user = await prisma.users.findFirst({
    where: {email: body.username},
  });
  if (user) {
    const valid = await compare(body.password!, user.password);
    if (valid) {
      ctx.body = JSON.parse(
          JSON.stringify(
              user,
              (key, value) => (typeof value === 'bigint' ? value.toString() : value),
          ),
      );
      delete ctx.body.password
      ctx.status = StatusCodes.OK;
      return;
    }
    ctx.status = StatusCodes.UNAUTHORIZED;
    return;
  }
  ctx.status = StatusCodes.NOT_FOUND;
};

// Validates zthat the user still exists
export const validateUserController: Middleware = async (ctx) => {
  const body: Credentials = ctx.request.body as Credentials;
  if (body.username === undefined || body.username.length <= 0) {
    ctx.throw(StatusCodes.NOT_ACCEPTABLE, 'missing username');
  }
  const user = await prisma.users.findFirst({
    where: {email: body.username},
  });

  if (user) {
    ctx.body = '';
    ctx.status = StatusCodes.OK;
    return;
  }

  ctx.status = StatusCodes.NOT_FOUND;
};
