import { DC } from "./constants";

/**
 * @abstract
 */
export class TimeTheoremPurchaseType {
  /**
  * @abstract
  */
  get amount() { throw new NotImplementedError(); }

  /**
  * @abstract
  */
  set amount(value) { throw new NotImplementedError(); }

  add(amount) { this.amount = this.amount.add(amount); }

  /**
  * @abstract
  */
  get currency() { throw new NotImplementedError(); }

  get cost() { return this.costBase.times(this.costIncrement.pow(this.amount)); }

  /**
   * @abstract
   */
  get costBase() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get costIncrement() { throw new NotImplementedError(); }

  get bulkPossible() {
    if (Perk.ttFree.canBeApplied) {
      return this.currency.value.divide(this.cost).log10().div(this.costIncrement.log10()).add(1).floor();
    }
    return Decimal.affordGeometricSeries(this.currency.value, this.cost, this.costIncrement, 0);
  }

  // Note: This is actually just the cost of the largest term of the geometric series. If buying EP without the
  // perk that makes them free, this will be incorrect, but the EP object already overrides this anyway
  bulkCost(amount) {
    return this.cost.times(this.costIncrement.pow(amount.sub(1)));
  }

  purchase(bulk = false) {
    if (!this.canAfford) return false;
    const cost = this.cost;

    if (!bulk) {
      Currency.timeTheorems.add(1);
      if (!Perk.ttFree.canBeApplied) this.currency.subtract(cost);
      this.add(1);
      return true;
    }
    let amntPur = Decimal.log(this.currency.value.sub(this.costBase).clampMin(1), this.costIncrement).add(1)
      .sub(Decimal.log(cost.sub(this.costBase).max(1), this.costIncrement)).floor();
    // We can definitely afford x - 1
    amntPur = amntPur.sub(1);
    Currency.timeTheorems.add(amntPur);
    this.add(amntPur);
    if (!Perk.ttFree.canBeApplied) this.currency.subtract(this.bulkCost(amntPur));
    // Can we afford another? If not, just return that we definitely bought some already
    if (this.currency.lt(cost)) return true;
    Currency.timeTheorems.add(1);
    if (!Perk.ttFree.canBeApplied) this.currency.subtract(cost);
    this.add(1);
    return true;
  }

  get canAfford() {
    return this.currency.gte(this.cost) && !player.eternities.eq(0);
  }

  reset() {
    this.amount = DC.D0;
  }
}

TimeTheoremPurchaseType.am = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.amBought; }
  set amount(value) { player.timestudy.amBought = value; }

  get currency() { return Currency.antimatter; }
  get costBase() { return DC.E20000; }
  get costIncrement() { return DC.E20000; }
}();

TimeTheoremPurchaseType.ip = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.ipBought; }
  set amount(value) { player.timestudy.ipBought = value; }

  get currency() { return Currency.infinityPoints; }
  get costBase() { return DC.D1; }
  get costIncrement() { return DC.E100; }
}();

TimeTheoremPurchaseType.ep = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.epBought; }
  set amount(value) { player.timestudy.epBought = value; }

  get currency() { return Currency.eternityPoints; }
  get costBase() { return DC.D1; }
  get costIncrement() { return DC.D2; }

  bulkCost(amount) {
    if (Perk.ttFree.canBeApplied) return this.cost.times(this.costIncrement.pow(amount.sub(1)));
    return this.costIncrement.pow(amount.add(this.amount)).subtract(this.cost);
  }
}();

export const TimeTheorems = {
  checkForBuying(auto) {
    if (PlayerProgress.realityUnlocked() || TimeDimension(1).bought) return true;
    if (!auto) Modal.message.show(`You need to buy at least ${formatInt(1)} Time Dimension before you can purchase
      Time Theorems.`, { closeEvent: GAME_EVENT.REALITY_RESET_AFTER });
    return false;
  },

  buyOne(auto = false, type) {
    if (!this.checkForBuying(auto)) return DC.D0;
    if (!TimeTheoremPurchaseType[type].purchase(false)) return DC.D0;
    return DC.D1;
  },

  // This is only called via automation and there's no manual use-case, so we assume auto is true and simplify a bit
  buyOneOfEach() {
    if (!this.checkForBuying(true)) return 0;
    const ttAM = this.buyOne(true, "am");
    const ttIP = this.buyOne(true, "ip");
    const ttEP = this.buyOne(true, "ep");
    return ttAM + ttIP + ttEP;
  },

  buyMax(auto = false) {
    if (!this.checkForBuying(auto)) return 0;
    const ttAM = TimeTheoremPurchaseType.am.purchase(true);
    const ttIP = TimeTheoremPurchaseType.ip.purchase(true);
    const ttEP = TimeTheoremPurchaseType.ep.purchase(true);
    return ttAM + ttIP + ttEP;
  },

  totalPurchased() {
    return TimeTheoremPurchaseType.am.amount
      .add(TimeTheoremPurchaseType.ip.amount)
      .add(TimeTheoremPurchaseType.ep.amount);
  },

  calculateTimeStudiesCost() {
    let totalCost = TimeStudy.boughtNormalTS()
      .map(ts => ts.cost)
      .reduce(Decimal.sumReducer, new Decimal());
    const ecStudy = TimeStudy.eternityChallenge.current();
    if (ecStudy !== undefined) {
      totalCost = totalCost.add(ecStudy.cost);
    }
    if (Enslaved.isRunning && player.celestials.enslaved.hasSecretStudy) totalCost = totalCost.sub(100);
    return totalCost;
  }
};
