/* eslint-disable no-unused-expressions */
import { DC } from "../constants";
import { GlyphInfo } from "../secret-formula/reality/core-glyph-info";

export function isMendingAvailable() {
  return Currency.antimatter.gte(MendingMilestone.six.isReached ? DC.E5E14 : DC.BIMAX);
}

export function mendingResetRequest() {
  if (!isMendingAvailable()) return;
  mendingReset();
}

function getGlyphTypes() {
  const v = { ...GlyphInfo };
  for (const item in GlyphInfo) {
    if (!GlyphInfo.glyphTypes.includes(item)) delete v[item];
  }
  return v;
}

function updateMendingRecords(MvRgain) {
  const thisRunRMmin = MvRgain.div(Time.thisMendRealTime.totalMinutes.clampMin(0.0005));
  if (player.records.bestMend.MvRmin.lt(thisRunRMmin)) {
    player.records.bestMend.MvRmin = thisRunRMmin;
  }

  if (player.records.bestMend.highestGL.lt(player.records.bestReality.glyphLevel)) {
    player.records.bestMend.highestGL = player.records.bestReality.glyphLevel;
  }

  if (MachineHandler.currentIMCap.gt(player.records.bestMend.highestiM)) {
    player.records.bestMend.highestiM = MachineHandler.currentIMCap;
  }

  if (player.reality.realityMachines.gt(player.records.bestMend.highestrM)) {
    player.records.bestMend.highestrM = player.reality.realityMachines;
  }

  player.records.bestMend.time = player.records.thisMend.time.clampMax(player.records.bestMend.time);
  if (player.records.thisMend.realTime.lt(player.records.bestMend.realTime)) {
    player.records.bestMend.realTime = player.records.thisMend.realTime;
  }

  player.records.bestMend.trueTime = Math.min(player.records.bestMend.trueTime, player.records.thisMend.trueTime);
  player.records.thisMend.time = DC.D0;
  player.records.thisMend.realTime = DC.D0;
  player.records.thisMend.trueTime = 0;
}

export function mendingReset() {
  EventHub.dispatch(GAME_EVENT.MENDING_RESET_BEFORE);
  // Do this first so we can do records and stuff based on stats, without fucking anything over
  Currency.mendingPoints.add(adRedGainedMendingPoints());
  Currency.mends.add(adRedGainedMends());
  player.realitiesBanked = player.realitiesBanked.add(Currency.realities.value.div(100)
    .mul(MendingUpgrade(7).effects.realities));
  updateMendingRecords(adRedGainedMendingPoints());
  addMendingTime(
    Time.thisMendTrueTime,
    Time.thisMendTime,
    Time.thisMendRealTime,
    player.reality.realityMachines,
    player.records.bestReality.glyphLevel,
    adRedGainedMendingPoints(),
    MachineHandler.currentIMCap,
    adRedGainedMendingPoints()
  );

  // Begin resetting the things
  // Celestials
  Teresa.reset();
  Effarig.reset();
  Enslaved.reset();
  V.reset();
  Ra.reset();
  Laitela.reset();
  Pelle.reset();
  player.isGameEnd = false;

  // Reality (Tier 3)
  player.reality.glyphs.protectedRows = 0;
  for (let g = 0; g < 120; g++) {
    const glyph = Glyphs.inventory[g];
    if (glyph !== null && glyph.type !== "companion") GlyphSacrificeHandler.deleteGlyph(glyph, true);
  }
  Glyphs.unequipAll(true);
  for (let h = 0; h < 120; h++) {
    const glyph = Glyphs.inventory[h];
    if (glyph !== null && glyph.type !== "companion") GlyphSacrificeHandler.deleteGlyph(glyph, true);
  }
  player.reality.realityMachines = DC.D0;
  player.reality.maxRM = DC.D0;
  player.reality.imaginaryMachines = DC.D0;
  player.reality.iMCap = DC.D0;
  player.realities = DC.D0;
  player.reality.glyphs.sac = {
    power: DC.D0,
    infinity: DC.D0,
    time: DC.D0,
    replication: DC.D0,
    dilation: DC.D0,
    effarig: DC.D0,
    reality: DC.D0
  };
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
      }))
  };
  player.reality.rebuyables = {
    1: new Decimal(),
    2: new Decimal(),
    3: new Decimal(),
    4: new Decimal(),
    5: new Decimal(),
  };
  player.reality.upgradeBits = 0;
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
  };
  player.reality.reqLock = {
    reality: 0,
    imaginary: 0,
  };
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
  }));
  player.blackHolePause = false;
  player.blackHoleAutoPauseMode = 0;
  player.blackHolePauseTime = DC.D0;
  player.blackHoleNegative = DC.D1;
  Player.resetRequirements("infinity");
  Player.resetRequirements("eternity");
  Player.resetRequirements("reality");

  // Eternity, Infinity (up to tier 2)

  initializeChallengeCompletions(false);

  Currency.infinities.reset();
  Currency.infinitiesBanked.reset();

  player.dimensionBoosts = DC.D0;
  player.galaxies = DC.D0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = true;
  player.IPMultPurchases = DC.D0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  Replicanti.reset(true);

  Currency.eternityPoints.reset();

  // This has to be reset before Currency.eternities to make the bumpLimit logic work correctly
  EternityUpgrade.epMult.reset();
  Currency.eternities.reset();
  player.bankedEternities = DC.D0;
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

  // Records
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
  };
  player.records.bestInfinity = {
    time: DC.BEMAX,
    realTime: DC.BEMAX,
    trueTime: 0,
    bestIPminEternity: DC.D0,
    bestIPminReality: DC.D0,
  };
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
  };
  player.records.bestEternity = {
    time: DC.BEMAX,
    realTime: DC.BEMAX,
    trueTime: 0,
    bestEPminReality: DC.D0,
  };
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
  };
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
  };
  lockAchievementsOnMend();
  InfinityChallenges.clearCompletions();
  Currency.infinityPoints.reset();
  // End resetting all the things
  const prebreakAch = [22, 47, 48, 51, 52, 53, 61, 165];
  for (let i = 0; i < prebreakAch.length; i++) {
    Achievement(prebreakAch[i]).unlock();
  }
  EventHub.dispatch(GAME_EVENT.MENDING_RESET_AFTER);
}

export function adRedGainedMendingPoints() {
  const x = DC.D1;
  return x;
}

export function adRedGainedMends() {
  const x = DC.D1;
  return x;
}

function lockAchievementsOnMend() {
  for (const achievement of Achievements.preMend) {
    achievement.lock();
  }
  player.reality.achTimer = DC.D0;
}

export class MendingMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    // If (Pelle.isDoomed && this.config.givenByPelle) {
    // return this.config.givenByPelle();
    // }
    return Currency.mends.gte(this.config.mends);
  }
}
export const MendingMilestone = mapGameDataToObject(
  GameDatabase.mending.mendingMilestones,
  config => (config.isBaseResource
    ? new MendingMilestoneState(config)
    : new MendingMilestoneState(config))
);