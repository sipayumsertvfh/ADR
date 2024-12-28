import { DC } from "../../../constants";

export const ecTimeStudies = [
  {
    id: 1,
    cost: new Decimal(30),
    requirement: [171],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Eternities",
      current: () => Currency.eternitiesTotal.value,
      required: completions => new Decimal(20000 + completions * 20000),
      formatValue: formatInt
    }
  },
  {
    id: 2,
    cost: new Decimal(35),
    requirement: [171],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Tickspeed upgrades from Time Dimensions",
      current: () => player.totalTickGained,
      required: completions => new Decimal(1300 + completions * 150),
      formatValue: formatInt
    }
  },
  {
    id: 3,
    cost: new Decimal(40),
    requirement: [171],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "8th Antimatter Dimensions",
      current: () => AntimatterDimension(8).totalAmount,
      required: completions => new Decimal(17300 + completions, 4 * 1250),
      formatValue: value => formatInt(Math.floor(value.toNumber()))
    }
  },
  {
    id: 4,
    cost: new Decimal(70),
    requirement: [143],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Infinities",
      current: () => Currency.infinitiesTotal.value,
      required: completions => new Decimal(1e8 + completions * 2.5e7),
      formatValue: value => formatInt(Math.floor(value.toNumber()))
    }
  },
  {
    id: 5,
    cost: new Decimal(130),
    requirement: [42],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Antimatter Galaxies",
      current: () => player.galaxies,
      required: completions => Decimal.min(completions, 200).times(14).add(160),
      formatValue: formatInt
    }
  },
  {
    id: 6,
    cost: new Decimal(85),
    requirement: [121],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Replicanti Galaxies",
      current: () => player.replicanti.galaxies,
      required: completions => Decimal.min(completions, 200).times(5).add(40),
      formatValue: formatInt
    }
  },
  {
    id: 7,
    cost: new Decimal(115),
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "antimatter",
      current: () => Currency.antimatter.value,
      required: completions => DC.E300000.pow(completions).times(DC.E500000),
      formatValue: value => format(value)
    }
  },
  {
    id: 8,
    cost: new Decimal(115),
    requirement: [123],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Infinity Points",
      current: () => Currency.infinityPoints.value,
      required: completions => DC.E1000.pow(completions).times(DC.E4000),
      formatValue: value => format(value)
    }
  },
  {
    id: 9,
    cost: new Decimal(415),
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Infinity Power",
      current: () => Currency.infinityPower.value,
      required: completions => DC.E2000.pow(completions).times(DC.E17500),
      formatValue: value => format(value)
    }
  },
  {
    id: 10,
    cost: new Decimal(550),
    requirement: [181],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Eternity Points",
      current: () => Currency.eternityPoints.value,
      required: completions => DC.E20.pow(completions).times(DC.E100),
      formatValue: value => format(value)
    }
  },
  {
    id: 11,
    cost: DC.D1,
    requirement: [231, 232],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      path: "Antimatter Dimension",
      forbiddenStudies: [72, 73],
    }
  },
  {
    id: 12,
    cost: DC.D1,
    requirement: [233, 234],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      path: "Time Dimension",
      forbiddenStudies: [71, 72],
    }
  }
];
