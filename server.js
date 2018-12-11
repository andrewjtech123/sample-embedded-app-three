const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
require('isomorphic-fetch');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

dotenv.config();
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, TUNNEL_URL } = process.env;

app.prepare().then(() => {
  const server = new Koa();
  server.use(session(server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['write_products', 'read_products'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
          const stringifiedBillingParams = JSON.stringify({
           recurring_application_charge: {
             name: 'Recurring charge',
             price: 20.01,
             return_url: TUNNEL_URL,
             test: true
           }
         })
         const options = {
           method: 'POST',
           body: stringifiedBillingParams,
           credentials: 'include',
           headers: {
             'X-Shopify-Access-Token': accessToken,
             'Content-Type': 'application/json',
           },
         };
          const confirmationURL = await fetch(
            `https://${shop}/admin/recurring_application_charges.json`, options)
            .then((response) => response.json())
            .then((jsonData) => jsonData.recurring_application_charge.confirmation_url)
            .catch((error) => console.log('error', error));
            ctx.redirect(confirmationURL);

      },

    }),
  );

  server.use(graphQLProxy());
  server.use(verifyRequest());
  server.use(async (ctx) => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
      ctx.res.statusCode = 200;
      return
  });
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
