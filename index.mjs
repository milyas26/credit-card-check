import { assert } from "chai";

// Test cases including multiple networks
describe("TestNetworkDetection", function () {
  const TEST_CASES = [
    ["341234567890123", "American Express"],
    ["371234567890123", "American Express"],
    ["38123456789012", "Diners Club"],
    ["4123456789012", "Visa"],
    ["4123456789012345", "Visa"],
    ["4123456789012345678", "Visa"],
    ["5112345678901234", "MasterCard"],
    ["5212345678901234", "MasterCard"],
    ["5312345678901234", "MasterCard"],
    ["5412345678901234", "MasterCard"],
    ["5512345678901234", "MasterCard"],
    ["6011123456789012345", "Discover"],
    ["6221261234567890", "Discover"],
    ["6441234567890123", "Discover"],
    ["6512345678901234", "Discover"],
    ["5034567890123456", "Maestro"],
    ["582126123456", "Maestro"],
    ["6220123456789012", "China UnionPay"],
    ["4903123456789012", "Switch"],
    ["633312345678901234", "Switch"],
    ["6759123456789012345", "Switch"],
  ];

  TEST_CASES.forEach(function ([cardNumber, expectedNetwork]) {
    it(`should detect ${expectedNetwork} for card number ${cardNumber}`, function () {
      let detectedNetwork = detectNetwork(cardNumber);
      if (Array.isArray(detectedNetwork)) {
        assert.include(
          detectedNetwork,
          expectedNetwork,
          `Card number ${cardNumber} is not in network ${expectedNetwork}.`
        );
      } else {
        assert.equal(
          detectedNetwork,
          expectedNetwork,
          `Card number ${cardNumber} is not in network ${expectedNetwork}.`
        );
      }
    });
  });
});

const networks = [
  {
    network: "American Express",
    prefix: ["34", "37"],
    length: [15],
  },
  {
    network: "Diners Club",
    prefix: ["38", "39"],
    length: [14],
  },
  {
    network: "Visa",
    prefix: ["4"],
    length: [13, 16, 19],
  },
  {
    network: "MasterCard",
    prefix: ["51", "52", "53", "54", "55"],
    length: [16],
  },
  {
    network: "Discover",
    prefix: ["6011", ["622126", "622925"], ["644", "649"], "65"],
    length: [16, 19],
  },
  {
    network: "Maestro",
    prefix: ["50", ["56", "59"]],
    length: [12, 13, 14, 15, 16, 17, 18, 19],
  },
  {
    network: "China UnionPay",
    prefix: [62],
    length: [16, 17, 18, 19],
  },
  {
    network: "Switch",
    prefix: [
      "4903",
      "4905",
      "4911",
      "4936",
      "564182",
      "633110",
      "6333",
      "6759",
    ],
    length: [16, 18, 19],
  },
];

const detectNetwork = (cardNumber) => {
  const detectedNetwork = [];

  networks.forEach(({ network: card, prefix, length }) => {
    prefix.forEach((prefix) => {
      const prefixes = Array.isArray(prefix)
        ? [...numberRange(parseInt(prefix[0]), parseInt(prefix[1]))]
        : [prefix];

      prefixes.forEach((prefix) => {
        if (
          cardNumber.startsWith(prefix) &&
          length.includes(cardNumber.length)
        ) {
          detectedNetwork.push(card);
        }
      });
    });
  });

  return detectedNetwork;
};

function numberRange(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}
