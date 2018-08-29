"use strict";

const { expect } = require("chai");
const saxes = require("../");
const { filter } = require("rxjs/operators");
it("parses a buffer", (done) => {
  const parser = new saxes.SaxesParser();
  let seen = false;
  parser.nodeStream.pipe(filter((x) => x.type === saxes.EVENTS.opentag)).subscribe((node) => {
    expect(node.data).to.deep.equal({ name: "x", attributes: {}, isSelfClosing: false });
    seen = true;
  }, error => {}, () => {
    expect(seen).to.be.true;
    done();
  });
  const xml = Buffer.from("<x>y</x>");
  parser.write(xml).close();
});
