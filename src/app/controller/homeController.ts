import { Middleware } from 'koa';
import { StatusCodes } from 'http-status-codes';

export const homeController: Middleware = async (ctx) => {
  ctx.body = {
    application: 'checkcredentials',
  };
  ctx.status = StatusCodes.OK;
};
