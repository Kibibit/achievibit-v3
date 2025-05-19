const { spawn } = require('child_process');

const jest = spawn('npx', ['jest', '--watch'], { stdio: 'inherit' });

jest.on('exit', (code) => {
  console.log('\nWatch mode exited. Running post-watch task...');
  const post = spawn('npm', ['run', 'posttest:custom'], { stdio: 'inherit' });
  post.on('exit', (postCode) => process.exit(code));
});
