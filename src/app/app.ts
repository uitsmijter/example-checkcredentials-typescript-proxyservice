import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { homeController } from './controller/homeController';
import { validateLoginController, validateUserController } from './controller/validateController';

const app:Koa = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async (ctx, next) => {
  return next().catch((err) => {
    const { statusCode, message } = err;

    ctx.type = 'json';
    ctx.status = statusCode || 500;
    ctx.body = {
      message,
      status: 'error',
    };

    ctx.app.emit('error', err, ctx);
  });
});

router.get('/', homeController);
router.post('/validate-login', validateLoginController);
router.post('/validate-user', validateUserController);

// Application error logging.
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.on('error', console.error);

export default app;
