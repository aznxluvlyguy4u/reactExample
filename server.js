const express = require('express');
const next = require('next');
require('jsdom-global')();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/', (req, res) => app.render(req, res, '/', req.params));

    server.get('/test', (req, res) => app.render(req, res, '/test', req.params));

    server.get('/search/:slug', (req, res) => app.render(req, res, '/search', { slug: req.params.slug }));
    // server.use('/static', express.static(path.join(__dirname, 'static')))

    // server.get("/dogs", (req, res) => {
    //   return app.render(req, res, "/dogs", req.params);
    // });

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.log(ex);
    process.exit(1);
  });
