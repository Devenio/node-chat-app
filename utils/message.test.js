const generateMessage = require("./message.js");
const mocha = require("mocha");
const expect = require("expect");

describe("Generate message: ", () => {
    it("should generate correct message object", () => {
        const from = "nima";
        const text = "test message";
        const message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(typeof message).toBe('object');
    })
})