const {generateMessage, generateLocationMessage} = require("./message.js");

const expect = require("expect");

describe("Generate message: ", () => {
    it("should generate correct message object", () => {
        const from = "Test";
        const text = "test message";
        const message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(typeof message).toBe('object');
    })
})

describe("Generate Location Message", () => {
    it("should generate correct data", () => {
        const from = "Test";
        const latitude = 10;
        const longitude = 20;
        const url = "https://www.google.com/maps?q=10,20"
        const message = generateLocationMessage(from, latitude, longitude)
        
        expect(message.from).toEqual(from);
        expect(typeof message.createdAt).toBe('number');
        expect(message.location_address).toEqual(url)
    })
})