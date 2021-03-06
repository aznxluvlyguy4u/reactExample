const express = require('express');
const next = require('next');
require('jsdom-global')();

const port = parseInt(process.env.PORT, 10) || 3000;
// false if not production
const dev = process.env.NODE_ENV !== 'production';
let app = null;
app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/', (req, res) => app.render(req, res, '/', req.params));

    server.get('/category/:category_id/:slug', (req, res) => app.render(req, res, '/category', {
        id: req.params.id,
        slug: req.param.slug
      })
    );

    server.get('/detail/:id/:slug', (req, res) => app.render(req, res, '/detail', {
        id: req.params.id,
        slug: req.param.slug
      })
    );

    // server.use('/static', express.static(path.join(__dirname, 'static')))
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
