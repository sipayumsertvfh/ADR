import { Ra } from "../globals";

import { AutobuyerState } from "./autobuyer";


/**
 * @abstract
 */
export class RaPetAutobuyerState extends AutobuyerState {
  /**
    * @abstract
    */
  get _petName() { throw new NotImplementedError(); }

  get data() {
    return player.auto.raMemories[this._petName].upgrades[this.id - 1];
  }

  get _upgradeName() {
    return ["levelUp", "purchaseChunkUpgrade", "purchaseMemoryUpgrade"][this.id - 1];
  }

  get name() {
    return ["Level Up", "Fragmentation", "Recollection"][this.id - 1];
  }

  get bulk() {
    return 0;
  }

  static get entryCount() {
    return 3;
  }

  get isUnlocked() {
    return MendingUpgrade(17).boughtAmount.gt(3);
  }


  tick() {
    const petName = this._petName;
    const upgradeName = this._upgradeName;
    Ra.pets[petName][upgradeName]();
  }
}