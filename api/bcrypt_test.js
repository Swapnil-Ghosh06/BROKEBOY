const bcrypt = require('bcryptjs');
(async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('testpassword', salt);
    console.log('Bcrypt test success:', hash.startsWith('$2'));
  } catch (e) {
    console.error('Bcrypt test failed:', e.message);
  }
})();
