// Fixture that exercises every AppSync runtime restriction.
export function handler() {
  const value = Number(42);
  async function load() {
    await Promise.resolve(1);
  }
  class Example { }
  const isArray = [] instanceof Array;
  for (let i = 0; i < 1; i++) { }
  while (false) { }
  do { } while (false);
  try {
    util.error("oops");
  } catch (error) {
    throw error;
  } finally {
    return;
  }
  for (; ;) {
    continue;
  }
  loop: for (; ;) {
    break loop;
  }
  const created = new Date();
  function* gen() {
    yield 1;
  }
  const self = this;
  let count = 0;
  count++;
  const inverted = ~count;
  const hasKey = "key" in {};
  const project = (item) => item;
  [ 1 ].map(project);
  [ { releasedAt: 1 } ].sort((left, right) => left.releasedAt - right.releasedAt);
  return { value, load, Example, isArray, created, gen, self, count, inverted, hasKey };
}
