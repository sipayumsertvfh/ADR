import { DC } from "../constants";
import { GlyphInfo } from "../secret-formula/reality/core-glyph-info";

export function mendingResetRequest(){

}

function getGlyphTypes() {
  const v = { ...GlyphInfo };
  for (const item in GlyphInfo) {
    if (!GlyphInfo.glyphTypes.includes(item)) delete v[item];
  }
  return v;
}

export function mendingReset(){
  EventHub.dispatch(GAME_EVENT.AD_RED_MENDING_RESET_BEFORE);
    //Add mending rewards here

    //Begin resetting the things
    //Celestials
    Teresa.reset();
    Effarig.reset();
    Enslaved.reset();
    V.reset();
    Ra.reset(); 
    Laitela.reset();
    Pelle.reset();
    player.isGameEnd = false;
    //Reality (Tier 3)
    const x = player.reality.glyphs.protectedRows;
    player.reality.glyphs.protectedRows = 0;
    for (let g = 0; g < 120; g++) {
      const glyph = Glyphs.inventory[g];
      if (glyph != null && glyph.type != "companion") GlyphSacrificeHandler.deleteGlyph(glyph, true);
    }
    Glyphs.unequipAll(true);
    for (let h = 0; h < 120; h++) {
      const glyph = Glyphs.inventory[h];
      if (glyph != null && glyph.type != "companion") GlyphSacrificeHandler.deleteGlyph(glyph, true);
    }
    player.reality.realityMachines = DC.D0;
    player.reality.maxRM = DC.D0;
    player.reality.imaginaryMachines = DC.D0;
    player.reality.iMCap = DC.D0;
    player.reality.glyphs.sac = {
        power: DC.D0,
        infinity: DC.D0,
        time: DC.D0,
        replication: DC.D0,
        dilation: DC.D0,
        effarig: DC.D0,
        reality: DC.D0
    },
    player.reality.glyphs.filter = {
      select: AUTO_GLYPH_SCORE.LOWEST_SACRIFICE,
      trash: AUTO_GLYPH_REJECT.SACRIFICE,
      simple: 0,
      types: Object.keys(getGlyphTypes())
        .filter(t => GlyphInfo.alchemyGlyphTypes.includes(t.id))
        .mapToObject(t => t.id, t => ({
          rarity: new Decimal(),
          score: 0,
          effectCount: 0,
          specifiedMask: [],
          effectScores: Array.repeat(0, t.effects().length).mapToObject(e => t.effects()[e].id, n => n),
        })),
    },
    player.reality.rebuyables = {
      1: new Decimal(),
      2: new Decimal(),
      3: new Decimal(),
      4: new Decimal(),
      5: new Decimal(),
    },
    player.reality.upgradeBits = 0,
    player.reality.upgReqs = 0;
    player.reality.imaginaryUpgradeBits = 0;
    player.reality.imaginaryUpgReqs = 0;
    player.reality.imaginaryRebuyables = {
      1: new Decimal(),
      2: new Decimal(),
      3: new Decimal(),
      4: new Decimal(),
      5: new Decimal(),
      6: new Decimal(),
      7: new Decimal(),
      8: new Decimal(),
      9: new Decimal(),
      10: new Decimal(),
    },
      player.reality.reqLock = {
        reality: 0,
        imaginary: 0,
      },
      player.reality.unlockedEC = 0;
      player.reality.lastAutoEC = DC.D0;
      player.reality.perks = new Set();
      player.reality.respec = false;
      player.reality.showGlyphSacrifice = false;
      player.reality.perkPoints = DC.D0;
      player.reality.partEternitied = DC.D0;
      player.reality.achTimer = new Decimal();
      player.blackHole = Array.range(0, 2).map(id => ({
        id,
        intervalUpgrades: DC.D0,
        powerUpgrades: DC.D0,
        durationUpgrades: DC.D0,
        phase: DC.D0,
        active: false,
        unlocked: false,
        activations: DC.D0,
      })),
      player.blackHolePause = false,
      player.blackHoleAutoPauseMode = 0;
      player.blackHolePauseTime = DC.D0;
      player.blackHoleNegative = DC.D1;

      //Eternity, Infinity (up to tier 2)

      initializeChallengeCompletions(true);

      Currency.infinities.reset();
      Currency.infinitiesBanked.reset();

      player.dimensionBoosts = DC.D0;
      player.galaxies = DC.D0;
      player.partInfinityPoint = 0;
      player.partInfinitied = 0;
      player.break = false;
      player.IPMultPurchases = DC.D0;
      Currency.infinityPower.reset();
      Currency.timeShards.reset();
      Replicanti.reset(true);
    
      Currency.eternityPoints.reset();
    
      // This has to be reset before Currency.eternities to make the bumpLimit logic work correctly
      EternityUpgrade.epMult.reset();
      Currency.eternities.reset();
      player.eternityUpgrades.clear();
      player.totalTickGained = DC.D0;
      player.eternityChalls = {};
      player.challenge.eternity.current = 0;
      player.challenge.eternity.unlocked = 0;
      player.challenge.eternity.requirementBits = 0;
      player.respec = false;
      player.eterc8ids = 50;
      player.eterc8repl = 40;
      Currency.timeTheorems.reset();
      player.celestials.v.STSpent = 0;
      player.dilation.studies = [];
      player.dilation.active = false;
      player.dilation.upgrades.clear();
      player.dilation.rebuyables = {
          1: DC.D0,
          2: DC.D0,
          3: DC.D0,
          11: DC.D0,
          12: DC.D0,
          13: DC.D0
        };
      Currency.tachyonParticles.reset();
      player.dilation.nextThreshold = DC.E3;
      player.dilation.baseTachyonGalaxies = DC.D0;
      player.dilation.totalTachyonGalaxies = DC.D0;
      Currency.dilatedTime.reset();
      player.dilation.lastEP = DC.DM1;
      Currency.antimatter.reset();
    
      playerInfinityUpgradesOnReset();
      resetInfinityRuns();
      resetEternityRuns();
      InfinityDimensions.fullReset();
      fullResetTimeDimensions();
      resetChallengeStuff();
      AntimatterDimensions.reset();
      secondSoftReset(false);
      player.celestials.ra.peakGamespeed = DC.D1;
    
      InfinityDimensions.resetAmount();
      resetTimeDimensions();
      resetTickspeed();
      AchievementTimers.marathon2.reset();
      Currency.infinityPoints.reset();
      Tab.dimensions.antimatter.show();
      Lazy.invalidateAll();
      ECTimeStudyState.invalidateCachedRequirements();
      player.reality.hasCheckedFilter = false;

      //Records
      player.records.totalAntimatter = DC.E1;
      player.records.recentInfinities = Array.range(0, 10).map(() =>
        [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, ""]);
      player.records.recentEternities = Array.range(0, 10).map(() =>
        [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, "", DC.D0]);
      player.records.recentRealities = Array.range(0, 10).map(() =>
        [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, 1, "", 0, 0]);
      player.records.thisInfinity = {
        time: DC.D0,
        realTime: DC.D0,
        trueTime: 0,
        lastBuyTime: DC.D0,
        maxAM: DC.D0,
        bestIPmin: DC.D0,
        bestIPminVal: DC.D0,
      },
      player.records.bestInfinity = {
        time: DC.BEMAX,
        realTime: DC.BEMAX,
        trueTime: 0,
        bestIPminEternity: DC.D0,
        bestIPminReality: DC.D0,
      },
      player.records.thisEternity = {
        time: DC.D0,
        realTime: DC.D0,
        trueTime: 0,
        maxAM: DC.D0,
        maxIP: DC.D0,
        bestIPMsWithoutMaxAll: DC.D0,
        bestEPmin: DC.D0,
        bestEPminVal: DC.D0,
        bestInfinitiesPerMs: DC.D0,
      },
      player.records.bestEternity = {
        time: DC.BEMAX,
        realTime: DC.BEMAX,
        trueTime: 0,
        bestEPminReality: DC.D0,
      },
      player.records.thisReality = {
        time: DC.D0,
        realTime: DC.D0,
        trueTime: 0,
        maxAM: DC.D0,
        maxIP: DC.D0,
        maxEP: DC.D0,
        bestEternitiesPerMs: DC.D0,
        maxReplicanti: DC.D0,
        maxDT: DC.D0,
        bestRSmin: DC.D0,
        bestRSminVal: DC.D0,
      },
      player.records.bestReality = {
        time: DC.BEMAX,
        realTime: DC.BEMAX,
        trueTime: 0,
        glyphStrength: DC.D0,
        RM: DC.D0,
        RMSet: [],
        RMmin: DC.D0,
        RMminSet: [],
        glyphLevel: DC.D0,
        glyphLevelSet: [],
        bestEP: DC.D0,
        bestEPSet: [],
        speedSet: [],
        iMCapSet: [],
        laitelaSet: [],
      }

      //End resetting all the things
      EventHub.dispatch(GAME_EVENT.AD_RED_MENDING_RESET_AFTER);
}

export function ad_red_gainedMendingPoints(){
  let x = DC.D1;
  return x;
}

export function ad_red_gainedMends(){
  let x = DC.D1;
  return x;
}

export class MendingMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    /*if (Pelle.isDoomed && this.config.givenByPelle) {
      return this.config.givenByPelle();
    }*/
    return Currency.mends.gte(this.config.mends);
  }
}
export const MendingMilestone = mapGameDataToObject(
  GameDatabase.mending.mendingMilestones,
  config => (config.isBaseResource
    ? new MendingMilestoneState(config)
    : new MendingMilestoneState(config))
);