<script>
import { DC } from "../../../core/constants";

import { MatterScale } from "./matter-scale";

import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "StatisticsTab",
  components: {
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      realTimeDoomed: TimeSpan.zero,
      totalAntimatter: new Decimal(),
      realTimePlayed: TimeSpan.zero,
      trueTimePlayed: TimeSpan.zero,
      timeSinceCreation: 0,
      uniqueNews: 0,
      totalNews: 0,
      secretAchievementCount: 0,
      infinity: {
        isUnlocked: false,
        count: new Decimal(),
        banked: new Decimal(),
        projectedBanked: new Decimal(),
        bankRate: new Decimal(),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        thisTrue: TimeSpan.zero,
        bestRate: new Decimal(),
      },
      eternity: {
        isUnlocked: false,
        count: new Decimal(),
        banked: new Decimal(),
        projectedBanked: new Decimal(),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        thisTrue: TimeSpan.zero,
        bestRate: new Decimal(),
      },
      reality: {
        isUnlocked: false,
        count: new Decimal(),
        hasBest: false,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        bestTrue: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        thisTrue: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
        bestRate: new Decimal(),
        bestRarity: 0,
        banked: new Decimal()
      },
      mending: {
        isUnlocked: false,
        count: new Decimal(),
        hasBest: false,
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        bestTrue: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        thisTrue: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
        bestRate: new Decimal(),
        bestLevel: 0,
      },
      hasSeenRealTimeSpeedup: false,
      matterScale: [],
      lastMatterTime: 0,
      paperclips: 0,
      fullTimePlayed: 0,
    };
  },
  computed: {
    // These are here to avoid extra spaces in-game pre-reality and to get around codefactor 120-char limits in the
    // HTML template due to the fact that adding a linebreak also adds a space
    infinityCountString() {
      const num = this.infinity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Infinity", num.floor())}`
        : "no Infinities";
    },
    eternityCountString() {
      const num = this.eternity.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Eternity", num.floor())}`
        : "no Eternities";
    },
    realityCountString() {
      const num = this.reality.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("Reality", num.floor())}`
        : "no Realities";
    },
    mendCountString() {
      const num = this.mending.count;
      return num.gt(0)
        ? `${this.formatDecimalAmount(num)} ${pluralize("time", num.floor())}`
        : "no Mends";
    },
    fullGameCompletions() {
      return player.records.fullGameCompletions;
    },
    startDate() {
      return Time.toDateTimeString(player.records.gameCreatedTime);
    },
    saveAge() {
      return TimeSpan.fromMilliseconds(new Decimal(this.timeSinceCreation));
    },
  },
  methods: {
    update() {
      const records = player.records;
      this.totalAntimatter.copyFrom(records.totalAntimatter);
      this.realTimePlayed.setFrom(records.realTimePlayed);
      this.trueTimePlayed.setFrom(new Decimal(records.trueTimePlayed));
      this.fullTimePlayed = TimeSpan.fromMilliseconds(
        new Decimal(records.previousRunRealTime.add(records.realTimePlayed)));
      this.uniqueNews = NewsHandler.uniqueTickersSeen;
      this.totalNews = player.news.totalSeen;
      this.secretAchievementCount = SecretAchievements.all.filter(a => a.isUnlocked).length;
      this.timeSinceCreation = Date.now() - player.records.gameCreatedTime;

      const progress = PlayerProgress.current;
      const isInfinityUnlocked = progress.isInfinityUnlocked;
      const infinity = this.infinity;
      const bestInfinity = records.bestInfinity;
      infinity.isUnlocked = isInfinityUnlocked;
      if (isInfinityUnlocked) {
        infinity.count.copyFrom(Currency.infinities);
        infinity.banked.copyFrom(Currency.infinitiesBanked);
        infinity.projectedBanked = new Decimal(0).plusEffectsOf(
          Achievement(131).effects.bankedInfinitiesGain,
          TimeStudy(191)
        );
        infinity.bankRate = infinity.projectedBanked.div(Decimal.clampMin(33, records.thisEternity.time)).times(60000);
        infinity.hasBest = !bestInfinity.time.eq(DC.BEMAX);
        infinity.best.setFrom(bestInfinity.time);
        infinity.this.setFrom(records.thisInfinity.time);
        infinity.bestRate.copyFrom(bestInfinity.bestIPminEternity);
      }

      const isEternityUnlocked = progress.isEternityUnlocked;
      const eternity = this.eternity;
      const bestEternity = records.bestEternity;
      eternity.isUnlocked = isEternityUnlocked;
      if (isEternityUnlocked) {
        eternity.count.copyFrom(Currency.eternities);
        eternity.banked.copyFrom(Currency.eternitiesBanked);
        eternity.projectedBanked = Currency.eternities.value.div(100)
          .mul(MendingUpgrade(7).effects.eternities);
        eternity.hasBest = !bestEternity.time.eq(DC.BEMAX);
        eternity.best.setFrom(bestEternity.time);
        eternity.this.setFrom(records.thisEternity.time);
        eternity.bestRate.copyFrom(bestEternity.bestEPminReality);
      }

      const isRealityUnlocked = progress.isRealityUnlocked;
      const reality = this.reality;
      const bestReality = records.bestReality;
      reality.isUnlocked = isRealityUnlocked;

      if (isRealityUnlocked) {
        reality.count.copyFrom(Currency.realities);
        reality.banked.copyFrom(Currency.realitiesBanked);
        reality.projectedBanked = Currency.realities.value.div(100)
          .mul(MendingUpgrade(7).effects.realities);
        reality.hasBest = !bestReality.time.eq(DC.BEMAX);
        reality.best.setFrom(bestReality.time);
        reality.bestReal.setFrom(bestReality.realTime);
        reality.this.setFrom(records.thisReality.time);
        reality.totalTimePlayed.setFrom(records.totalTimePlayed);
        // Real time tracking is only a thing once reality is unlocked:
        infinity.thisReal.setFrom(records.thisInfinity.realTime);
        infinity.bankRate = infinity.projectedBanked.div(Decimal.clampMin(33, records.thisEternity.realTime))
          .times(60000);
        eternity.thisReal.setFrom(records.thisEternity.realTime);
        reality.thisReal.setFrom(records.thisReality.realTime);
        reality.bestRate.copyFrom(bestReality.RMmin);
        reality.bestRarity = strengthToRarity(bestReality.glyphStrength).clampMin(0);
      }

      const isMendingUnlocked = progress.isMendingUnlocked;
      const mending = this.mending;
      const bestMend = records.bestMend;
      mending.isUnlocked = isMendingUnlocked;

      if (isMendingUnlocked) {
        mending.hasBest = bestMend.time.neq(DC.BEMAX);
        mending.count.copyFrom(Currency.mends);
        mending.best.setFrom(bestMend.time);
        mending.bestReal.setFrom(bestMend.realTime);
        mending.this.setFrom(records.thisMend.time);
        mending.thisReal.setFrom(records.thisMend.realTime);
      }
      this.updateMatterScale();
      this.hasSeenRealTimeSpeedup = Decimal.neq(player.records.realTimePlayed, player.records.trueTimePlayed);

      if (this.hasSeenRealTimeSpeedup) {
        this.infinity.thisTrue.setFrom(new Decimal(player.records.thisInfinity.trueTime));
        this.eternity.thisTrue.setFrom(new Decimal(player.records.thisEternity.trueTime));
        this.reality.thisTrue.setFrom(new Decimal(player.records.thisReality.trueTime));
        this.mending.thisTrue.setFrom(new Decimal(player.records.thisMend.trueTime));
        this.reality.bestTrue.setFrom(new Decimal(player.records.bestReality.trueTime));
        this.mending.bestTrue.setFrom(new Decimal(player.records.bestMend.trueTime));
      }

      this.isDoomed = Pelle.isDoomed;
      this.realTimeDoomed.setFrom(player.records.realTimeDoomed);
      this.paperclips = player.news.specialTickerData.paperclips;
    },
    formatDecimalAmount(value) {
      return value.gt(1e9) ? format(value, 3) : formatInt(Math.floor(value.toNumber()));
    },
    // Only updates once per second to reduce jitter
    updateMatterScale() {
      if (Date.now() - this.lastMatterTime > 1000) {
        this.matterScale = MatterScale.estimate(Currency.antimatter.value);
        this.lastMatterTime = Date.now();
      }
    },
    realityClassObject() {
      return {
        "c-stats-tab-title": true,
        "c-stats-tab-reality": !this.isDoomed,
        "c-stats-tab-doomed": this.isDoomed,
      };
    }
  },
};
</script>

<template>
  <div class="c-stats-tab">
    <div>
      <PrimaryButton onclick="Modal.catchup.show(0)">
        View Content Summary
      </PrimaryButton>
      <div class="c-stats-tab-title c-stats-tab-general">
        General
      </div>
      <div class="c-stats-tab-general">
        <!-- eslint-disable-next-line max-len -->
        <div>You have made a total of {{ format(totalAntimatter, 2, 1) }} antimatter {{ mending.isUnlocked ? "in this Mended Multiverse" : "" }}.</div>
        <div v-if="hasSeenRealTimeSpeedup">
          You have played {{ trueTimePlayed }} of actual time.
        </div>
        <div>You have played for {{ realTimePlayed }}. (real time)</div>
        <div v-if="reality.isUnlocked">
          Your existence has spanned {{ reality.totalTimePlayed }} of time. (game time)
        </div>
        <div>
          Your save was created on {{ startDate }} ({{ saveAge }} ago)
        </div>
        <br>
        <div>
          You have seen {{ quantifyInt("news message", totalNews) }} in total.
        </div>
        <div>
          You have seen {{ quantifyInt("unique news message", uniqueNews) }}.
        </div>
        <div>
          You have unlocked {{ quantifyInt("Secret Achievement", secretAchievementCount) }}.
        </div>
        <div v-if="paperclips">
          You have {{ quantifyInt("useless paperclip", paperclips) }}.
        </div>
        <div v-if="fullGameCompletions">
          <br>
          <b>
            You have completed the entire game {{ quantifyInt("time", fullGameCompletions) }}.
            <br>
            You have played for {{ fullTimePlayed }} across all playthroughs.
          </b>
        </div>
      </div>
      <div>
        <br>
        <div class="c-matter-scale-container c-stats-tab-general">
          <div
            v-for="(line, i) in matterScale"
            :key="i"
          >
            {{ line }}
          </div>
          <br v-if="matterScale.length < 2">
          <br v-if="matterScale.length < 3">
        </div>
      </div>
      <br>
    </div>
    <div
      v-if="infinity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-infinity">
        Infinity
      </div>
      <div>
        You have {{ infinityCountString }}<span v-if="eternity.isUnlocked"> this Eternity</span>.
      </div>
      <div v-if="infinity.banked.gt(0)">
        You have {{ formatDecimalAmount(infinity.banked.floor()) }}
        {{ pluralize("Banked Infinity", infinity.banked.floor()) }}.
      </div>
      <div v-if="infinity.hasBest">
        Your fastest Infinity was {{ infinity.best.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Infinity<span v-if="eternity.isUnlocked"> this Eternity</span>.
      </div>
      <div>
        You have spent {{ infinity.this.toStringShort() }} in this Infinity.
        <span v-if="reality.isUnlocked">
          ({{ infinity.thisReal.toStringShort() }} real time)
        </span>
        <span v-if="hasSeenRealTimeSpeedup">
          ({{ infinity.thisTrue.toStringShort() }} actual time)
        </span>
      </div>
      <div>
        Your best Infinity Points per minute
        <span v-if="eternity.count.gt(0)">this Eternity </span>
        is {{ format(infinity.bestRate, 2, 2) }}.
      </div>
      <br>
    </div>
    <div
      v-if="eternity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-eternity">
        Eternity
      </div>
      <div>
        You have {{ eternityCountString }}<span v-if="reality.isUnlocked"> this Reality</span>.
      </div>
      <div v-if="eternity.banked.gt(0)">
        You have {{ formatDecimalAmount(eternity.banked.floor()) }}
        {{ pluralize("Banked Eternity", eternity.banked.floor()) }}.
      </div>
      <div v-if="infinity.projectedBanked.gt(0)">
        You will gain {{ formatDecimalAmount(infinity.projectedBanked.floor()) }}
        {{ pluralize("Banked Infinity", infinity.projectedBanked.floor()) }} on Eternity
        ({{ formatDecimalAmount(infinity.bankRate) }} per minute).
      </div>
      <div v-else-if="infinity.banked.gt(0)">
        You will gain no Banked Infinities on Eternity.
      </div>
      <div v-if="eternity.hasBest">
        Your fastest Eternity was {{ eternity.best.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Eternity<span v-if="reality.isUnlocked"> this Reality</span>.
      </div>
      <div>
        You have spent {{ eternity.this.toStringShort() }} in this Eternity.
        <span v-if="reality.isUnlocked">
          ({{ eternity.thisReal.toStringShort() }} real time)
        </span>
        <span v-if="hasSeenRealTimeSpeedup">
          ({{ eternity.thisTrue.toStringShort() }} actual time)
        </span>
      </div>
      <div>
        Your best Eternity Points per minute
        <span v-if="reality.isUnlocked">this Reality </span>
        is {{ format(eternity.bestRate, 2, 2) }}.
      </div>
      <br>
    </div>
    <div
      v-if="reality.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div :class="realityClassObject()">
        {{ isDoomed ? "Doomed Reality" : "Reality" }}
      </div>
      <div>You have {{ realityCountString }}<span v-if="mending.isUnlocked"> in this Mended Multiverse</span>.</div>
      <div v-if="reality.banked.gt(0)">
        You have {{ formatDecimalAmount(reality.banked.floor()) }}
        {{ pluralize("Banked Reality", reality.banked.floor()) }}.
      </div>
      <div v-if="eternity.projectedBanked.gt(0)">
        You will gain {{ formatDecimalAmount(eternity.projectedBanked.floor()) }}
        {{ pluralize("Banked Eternity", eternity.projectedBanked.floor()) }} on Reality.
      </div>
      <div v-else-if="eternity.banked.gt(0)">
        You will gain no Banked Eternities on Reality.
      </div>
      <div
        v-if="reality.hasBest"
      >
        <div>Your fastest game-time Reality was {{ reality.best.toStringShort() }}.</div>
        <div>Your fastest real-time Reality was {{ reality.bestReal.toStringShort() }}.</div>
        <div v-if="hasSeenRealTimeSpeedup">
          Your fastest actual-time Reality was {{ reality.bestTrue.toStringShort() }}.
        </div>
      </div>
      <div v-else>
        You have no fastest Reality<span v-if="mending.isUnlocked"> in this Mended Multiverse</span>.
      </div>
      <div :class="{ 'c-stats-tab-doomed' : isDoomed }">
        You have spent {{ reality.this.toStringShort() }}
        in this {{ isDoomed ? "Armageddon" : "Reality" }}.
        ({{ reality.thisReal.toStringShort() }} real time) <span v-if="hasSeenRealTimeSpeedup">
          ({{ reality.thisTrue.toStringShort() }} actual time)
        </span>
      </div>
      <div
        v-if="isDoomed"
        class="c-stats-tab-doomed"
      >
        You have been Doomed for {{ realTimeDoomed.toStringShort() }}, real time.
      </div>
      <div>
        <!-- eslint-disable-next-line max-len -->
        Your best Reality Machines per minute {{ mending.isUnlocked ? "this Mend" : "" }} is {{ format(reality.bestRate, 2, 2) }}.
      </div>
      <!-- eslint-disable-next-line max-len -->
      <div>Your best Glyph rarity {{ mending.isUnlocked ? "this Mend" : "" }} is {{ formatRarity(reality.bestRarity) }}.</div>
      <br>
    </div>
    <br>
    <br>
    <div
      v-if="mending.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
    >
      <div class="c-stats-tab-title c-stats-tab-mending">
        Mending
      </div>
      <div>You have Mended this Multiverse {{ mendCountString }}.</div>
      <div v-if="reality.projectedBanked.gt(0)">
        You will gain {{ formatDecimalAmount(reality.projectedBanked.floor()) }}
        {{ pluralize("Banked Reality", reality.projectedBanked.floor()) }} on Mend.
      </div>
      <div v-if="mending.hasBest">
        Your fastest Mend was {{ mending.best.toStringShort() }} ({{ mending.bestReal.toStringShort() }} real time).
      </div>
      <div v-else>
        You have no fastest Mend.
      </div>
      <div>
        You have spent {{ mending.this.toStringShort() }} in this Mend.
        ({{ mending.thisReal.toStringShort() }} real time)
      </div>
      <br>
    </div>
  </div>
</template>

<style scoped>
.c-matter-scale-container {
  height: 5rem;
}

.c-stats-tab-general {
  color: var(--color-text);
}

.c-stats-tab-title {
  font-size: 2rem;
  font-weight: bold;
}

.c-stats-tab-subheader {
  height: 15rem;
}

.c-stats-tab-infinity {
  color: var(--color-infinity);
}

.c-stats-tab-eternity {
  color: var(--color-eternity);
}

.c-stats-tab-reality {
  color: var(--color-reality);
}

.c-stats-tab-doomed {
  color: var(--color-pelle--base);
}

.c-stats-tab-mending {
  color: var(--color-mending);
}
</style>