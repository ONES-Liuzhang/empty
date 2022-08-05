const random = (Math.random() * 1000).toFixed();

if (random & 1) {
  process.exit(1);
}
