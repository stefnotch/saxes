"use strict";

const { expect } = require("chai");
const saxes = require("../lib/saxes");

// handy way to do simple unit tests
// if the options contains an xml string, it'll be written and the parser closed.
// otherwise, it's assumed that the test will write and close.
exports.test = function test(options) {
  const { xml, name, expect: expected, fn } = options;
  it(name, (done) => {
    const parser = new saxes.SaxesParser(options.opt);
    let expectedIx = 0;
    parser.nodeStream.subscribe((result) => {
      let ev = result.type;
      let n = result.data;
      if (process.env.DEBUG) {
        // eslint-disable-next-line no-console
        console.error({
          expected: expected[expectedIx],
          actual: [ev, n],
        });
      }
      if (expectedIx >= expected.length && (ev === saxes.EVENTS.end)) {
        return;
      }
      else {
        if (ev === saxes.EVENTS.opentagstart || ev === saxes.EVENTS.opentag) {
          if (n.ns) {
            // We have to remove the prototype from n.ns. Otherwise,
            // the deep equal check fails because the tests were
            // written to check only the namespaces immediately
            // defined on the tag whereas deep equal compares
            // **all** enumerable properties and thus effectively
            // examines up the chain of namespaces.

            n = Object.assign({}, n);

            // We shallow copy.
            n.ns = Object.assign(Object.create(null), n.ns);
          }
        }

        let hack = expected[expectedIx];
        if(typeof hack[0] == "string") hack[0] = saxes.EVENTS[hack[0]];
        expect(hack[0]).to.not.equal(undefined);
        expect(ev).to.not.be.equal(undefined);
        expect([ev, n]).to.deep.equal(hack);
      }
      expectedIx++;
    }, error => {
      expect(expected[expectedIx][0]).to.equal("error");
      expectedIx++;
      done();
    }, () => {
      expect(expectedIx).to.equal(expected.length);
      done();
    })


    expect(xml !== undefined || fn !== undefined,
           "must use xml or fn").to.be.true;

    if (xml !== undefined) {
      parser.write(xml).close();
    }

    if (fn !== undefined) {
      fn(parser);
    }
  });
};
