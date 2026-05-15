const jwt = require('jsonwebtoken');
try {
  const token = jwt.sign({ id: 'test' }, 'secret');
  const decoded = jwt.verify(token, 'secret');
  console.log('JWT test success:', decoded.id === 'test');
} catch (e) {
  console.error('JWT test failed:', e.message);
}
