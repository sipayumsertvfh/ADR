<!-- eslint-disable camelcase -->
<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import CustomizeableTooltip from "@/components/CustomizeableTooltip";
import GlyphSetPreview from "@/components/GlyphSetPreview";
import HardTeresaToggle from "./HardTeresaToggle";
import PerkShopUpgradeButton from "./PerkShopUpgradeButton";

export default {
  name: "TeresaTab",
  components: {
    GlyphSetPreview,
    PerkShopUpgradeButton,
    CelestialQuoteHistory,
    CustomizeableTooltip,
    HardTeresaToggle
  },
  data() {
    return {
      pour: false,
      time: new Date().getTime(),
      pouredAmount: 0,
      isPouredAmountCapped: false,
      rm: new Decimal(0),
      percentage: "",
      possibleFillPercentage: "",
      rmMult: 0,
      bestAM: new Decimal(0),
      bestAMSet: [],
      lastMachines: new Decimal(0),
      lastiM: new Decimal(),
      runReward: new Decimal(),
      perkPoints: new Decimal(),
      hasReality: false,
      hasEPGen: false,
      hasPerkShop: false,
      raisedPerkShop: false,
      isRunning: false,
      canUnlockNextPour: false,
      hardTeresaToggled: false,
      hard_bestAM: new Decimal(0),
      hard_bestAMSet: [],
      hard_lastMachines: new Decimal(0),
      hard_lastiM: new Decimal(),
      hard_runReward: new Decimal(),
      hardModeUnlocked: false,
      hasTeresa65: false
    };
  },
  computed: {
    unlockInfos: () => TeresaUnlocks.all,
    pouredAmountCap: () => Teresa.pouredAmountCap,
    showRunReward() {
      return this.bestAM.gt(1);
    },
    showHardRunReward() {
      return this.hard_bestAM.gt(1);
    },
    upgrades() {
      const upgrades = [
        PerkShopUpgrade.glyphLevel,
        PerkShopUpgrade.rmMult,
        PerkShopUpgrade.bulkDilation,
        PerkShopUpgrade.autoSpeed,
        PerkShopUpgrade.musicGlyph,
      ];
      if (this.raisedPerkShop) upgrades.push(PerkShopUpgrade.fillMusicGlyph);
      if (this.hasTeresa65) {
        upgrades.push(PerkShopUpgrade.glyphInstability);
        upgrades.push(PerkShopUpgrade.imCap);
      }
      return upgrades;
    },
    runButtonClassObject() {
      return {
        "c-teresa-run-button__icon": true,
        "c-teresa-run-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    pourButtonClassObject() {
      return {
        "o-teresa-shop-button": true,
        "c-teresa-pour": true,
        "o-teresa-shop-button--available": !this.isPouredAmountCapped,
        "o-teresa-shop-button--capped": this.isPouredAmountCapped,
        "c-teresa-pour--unlock-available": this.canUnlockNextPour,
        "c-disabled-pour": this.isPouredAmountCapped
      };
    },
    pourText() {
      return this.isPouredAmountCapped ? "Filled" : "Pour RM";
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[0].effects();
    },
    hard_runDescription() {
      return GameDatabase.celestials.descriptions[7].effects();
    },
    lastMachinesString() {
      return this.lastiM.eq(0)
        ? `${quantify("Reality Machine", this.lastMachines, 2)}`
        : `${quantify("Imaginary Machine", this.lastiM, 2)}`;
    },
    hard_lastMachinesString() {
      return this.hard_lastiM.eq(0)
        ? `${quantify("Reality Machine", this.hard_lastMachines, 2)}`
        : `${quantify("Imaginary Machine", this.hard_lastiM, 2)}`;
    },
    unlockInfoTooltipArrowStyle() {
      return {
        borderRight: "0.5rem solid var(--color-teresa--base)"
      };
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      const now = new Date().getTime();
      if (this.pour) {
        const diff = (now - this.time) / 1000;
        Teresa.pourRM(diff);
      } else {
        Teresa.timePoured = 0;
      }
      this.time = now;
      this.pouredAmount = player.celestials.teresa.pouredAmount;
      this.isPouredAmountCapped = this.pouredAmount === this.pouredAmountCap;
      this.percentage = `${(Teresa.fill * 100).toFixed(2)}%`;
      this.possibleFillPercentage = `${(Teresa.possibleFill * 100).toFixed(2)}%`;
      this.rmMult = Teresa.rmMultiplier;
      this.hasReality = TeresaUnlocks.run.isUnlocked;
      this.hasEPGen = TeresaUnlocks.epGen.isUnlocked;
      this.hasPerkShop = TeresaUnlocks.shop.isUnlocked;
      this.raisedPerkShop = Ra.unlocks.perkShopIncrease.canBeApplied;
      this.bestAM.copyFrom(player.celestials.teresa.bestRunAM);
      this.hard_bestAM.copyFrom(player.celestials.teresa.hard.bestRunAM);
      this.bestAMSet = cloneDeep(Glyphs.copyForRecords(player.celestials.teresa.bestAMSet));
      this.hard_bestAMSet = cloneDeep(Glyphs.copyForRecords(player.celestials.teresa.hard.bestAMSet));
      this.lastMachines.copyFrom(player.celestials.teresa.lastRepeatedMachines);
      this.lastiM.copyFrom(player.celestials.teresa.lastRepeatediM);
      this.hard_lastMachines.copyFrom(player.celestials.teresa.hard.lastRepeatedMachines);
      this.hard_lastiM.copyFrom(player.celestials.teresa.hard.lastRepeatediM);
      this.runReward.copyFrom(Teresa.runRewardMultiplier);
      this.hard_runReward.copyFrom(Teresa.hardRunRewardPower);
      this.perkPoints.copyFrom(Currency.perkPoints.value);
      this.rm.copyFrom(Currency.realityMachines);
      this.isRunning = Teresa.isRunning;
      this.canUnlockNextPour = TeresaUnlocks.all
        .filter(unlock => this.rm.plus(this.pouredAmount).gte(unlock.price) && !unlock.isUnlocked).length > 0;
      this.hardTeresaToggled = Teresa.hardModeToggled;
      this.hardModeUnlocked = Teresa.hardModeUnlocked;
      this.hasTeresa65 = Ra.unlocks.perkShopUpgrades.canBeApplied;
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Teresa's", number: 0 });
    },
    unlockDescriptionHeight(unlockInfo) {
      const maxPrice = TeresaUnlocks[Teresa.lastUnlock].price;
      const pos = Math.log1p(unlockInfo.price) / Math.log1p(maxPrice);
      return `calc(${(100 * pos).toFixed(2)}% - 0.1rem)`;
    },
    hasUnlock(unlockInfo) {
      return unlockInfo.isUnlocked;
    },
    unlockInfoTooltipClass(unlockInfo) {
      return {
        "c-teresa-unlock-description": true,
        "c-teresa-unlock-description--unlocked": this.hasUnlock(unlockInfo)
      };
    }
  }
};
</script>

<template>
  <div class="l-teresa-celestial-tab">
    <CelestialQuoteHistory celestial="teresa" />
    <div>
      You have {{ quantify("Reality Machine", rm, 2, 2) }}.
    </div>
    <div class="l-mechanics-container">
      <div
        v-if="hasReality && !hardTeresaToggled"
        class="l-teresa-mechanic-container"
      >
        <div class="c-teresa-unlock c-teresa-run-button">
          <div class="flex">
            <span :class="{ 'o-pelle-disabled': isDoomed }">
              Start Teresa's Reality.
            </span>
            <div v-if="hardModeUnlocked">
              <HardTeresaToggle />
            </div>
          </div>
          <div
            :class="runButtonClassObject"
            @click="startRun()"
          >
            Ϟ
          </div>
          {{ runDescription }}
          <br><br>
          <div>
            This Reality can be repeated for a stronger reward based on the antimatter gained within it.
            <br><br>
            <span v-if="showRunReward">
              Your record antimatter in Teresa's Reality is {{ format(bestAM, 2) }},
              achieved with {{ lastMachinesString }}.
              <br><br>
              Glyph Set used:
              <GlyphSetPreview
                text="Teresa's Best Glyph Set"
                :text-hidden="true"
                :force-name-color="false"
                :glyphs="bestAMSet"
              />
            </span>
            <span v-else>
              You have not completed Teresa's Reality yet.
            </span>
          </div>
        </div>
        <div
          v-if="showRunReward"
          class="c-teresa-unlock"
        >
          Teresa Reality reward: Glyph Sacrifice power {{ formatX(runReward, 2, 2) }}
        </div>
        <div
          v-if="hasEPGen"
          class="c-teresa-unlock"
        >
          <span :class="{ 'o-pelle-disabled': isDoomed }">
            Every second, you gain {{ formatPercents(0.01) }} of your peaked Eternity Points per minute this Reality.
          </span>
        </div>
      </div>
      <div
        v-if="hasReality && hardTeresaToggled"
        class="l-teresa-mechanic-container"
      >
        <div class="c-teresa-unlock c-hard-teresa-run-button">
          <div class="hard-flex">
            <span :class="{ 'o-pelle-disabled': isDoomed }">
              Start Teresa's Hardened Reality.
            </span>
            <HardTeresaToggle />
          </div>
          <div
            :class="runButtonClassObject"
            @click="startRun()"
          >
            Ϟ
          </div>
          {{ hard_runDescription }}
          <br><br>
          <div>
            This Reality can be repeated for a stronger reward based on the antimatter gained within it.
            <div v-if="!showHardRunReward">
              On first completion, allow the sacrifice from Reality Glyphs to be affected by Teresa's Reality.
            </div>
            <br><br>
            <span v-if="showHardRunReward">
              Your record antimatter in Teresa's Hardened Reality is {{ format(hard_bestAM, 2) }},
              achieved with {{ hard_lastMachinesString }}.
              <br><br>
              Glyph Set used:
              <GlyphSetPreview
                text="Teresa's Hardened Reality: Best Glyph Set"
                :text-hidden="true"
                :force-name-color="false"
                :glyphs="hard_bestAMSet"
              />
            </span>
            <span v-else>
              You have not completed Teresa's Hardened Reality yet.
            </span>
          </div>
        </div>
        <div
          v-if="showHardRunReward"
          class="c-teresa-unlock"
        >
          Teresa's Hardened Reality reward: Glyph Sacrifice Cap ^{{ format(hard_runReward, 2, 2) }}
        </div>
        <div
          v-if="hasEPGen"
          class="c-teresa-unlock"
        >
          <span :class="{ 'o-pelle-disabled': isDoomed }">
            Every second, you gain {{ formatPercents(0.01) }} of your peaked Eternity Points per minute this Reality.
          </span>
        </div>
      </div>
      <div class="l-rm-container l-teresa-mechanic-container">
        <button
          :class="pourButtonClassObject"
          @mousedown="pour = true"
          @touchstart="pour = true"
          @mouseup="pour = false"
          @touchend="pour = false"
          @mouseleave="pour = false"
        >
          {{ pourText }}
        </button>
        <div class="c-rm-store">
          <div
            class="c-rm-store-inner c-rm-store-inner--light"
            :style="{ height: possibleFillPercentage}"
          />
          <div
            class="c-rm-store-inner"
            :style="{ height: percentage}"
          >
            <div class="c-rm-store-label">
              {{ formatX(rmMult, 2, 2) }} RM gain
              <br>
              {{ format(pouredAmount, 2, 2) }}/{{ format(pouredAmountCap, 2, 2) }}
            </div>
          </div>
          <CustomizeableTooltip
            v-for="unlockInfo in unlockInfos"
            :key="unlockInfo.id"
            content-class="c-teresa-unlock-description--hover-area"
            :bottom="unlockDescriptionHeight(unlockInfo)"
            right="0"
            mode="right"
            :show="true"
            :tooltip-arrow-style="unlockInfoTooltipArrowStyle"
            :tooltip-class="unlockInfoTooltipClass(unlockInfo)"
          >
            <template #mainContent>
              <div
                class="c-teresa-milestone-line"
                :class="{ 'c-teresa-milestone-line--unlocked': hasUnlock(unlockInfo) }"
              />
            </template>
            <template #tooltipContent>
              <b :class="{ 'o-pelle-disabled': unlockInfo.pelleDisabled }">
                {{ format(unlockInfo.price, 2, 2) }}: {{ unlockInfo.description }}
              </b>
            </template>
          </CustomizeableTooltip>
        </div>
      </div>
      <div
        v-if="hasPerkShop"
        class="c-teresa-shop"
      >
        <span class="o-teresa-pp">
          You have {{ quantify("Perk Point", perkPoints, 2, 0) }}.
        </span>
        <PerkShopUpgradeButton
          v-for="upgrade in upgrades"
          :key="upgrade.id"
          :upgrade="upgrade"
        />
        You can now modify the appearance of your Glyphs to look like Music Glyphs.
      </div>
      <div
        v-else
        class="l-rm-container-labels l-teresa-mechanic-container"
      />
    </div>
  </div>
</template>

<style scoped>
.c-disabled-pour {
  opacity: 0.8;
  pointer-events: none;
}

.flex {
  display: flex;
  position: relative;
  left: 1.75rem
}

.hard-flex {
  display: flex;
  position: relative;
  left: 1rem
}
</style>
