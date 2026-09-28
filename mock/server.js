const path = require('path');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const routes = require('./routes.json');

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(jsonServer.rewriter(routes));

/**
 * Assign the next serial numeric id (1, 2, 3...) for new employees.
 * json-server otherwise generates random ids like "V1kek-j".
 */
server.use((req, res, next) => {
  if (req.method === 'POST' && isEmployeeCollection(req.path)) {
    const employees = router.db.get('employee').value();
    const nextId = nextSerialId(employees);
    req.body.id = String(nextId);
    if (!req.body.createdAt) {
      req.body.createdAt = new Date().toISOString();
    }
  }
  next();
});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
  console.log(`  GET/POST   http://localhost:${PORT}/api/v1/employee`);
  console.log(`  GET        http://localhost:${PORT}/api/v1/country`);
});

function isEmployeeCollection(requestPath) {
  const normalized = requestPath.replace(/\/$/, '');
  return normalized === '/employee' || normalized === '/api/v1/employee';
}

function nextSerialId(employees) {
  return employees.reduce((max, employee) => {
    const numericId = Number(employee.id);
    return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
  }, 0) + 1;
}
