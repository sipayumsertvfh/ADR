<!-- eslint-disable vue/html-comment-indent -->
<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import CelestialStudyButton from "./CelestialStudyButton";

export default {
  name: "NormalCelestialStudy",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    HintText,
    CelestialStudyButton
  },
  props: {
    setup: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    showCost: true,
    showSTCost: false,
    isUseless: false
  }),
  computed: {
    study() {
      return this.setup.study;
    },
    hintText() {
      const id = this.study.id;
      if (!this.setup.path) return `C${id}`;
      const pathEntry = CelestialStudies.pathList.find(p => p.path === this.setup.path);
      return `C${id} ${pathEntry.name}`;
    },
  },
  methods: {
    update() {
      this.showCost = true;
    },
  }
};
</script>

<template>
  <CelestialStudyButton
    :setup="setup"
    :show-cost="showCost"
  >
    <HintText
      type="studies"
      class="l-hint-text--time-study"
    >
      {{ hintText }}
    </HintText>
    <span :class="{ 'o-pelle-disabled': isUseless }">
      <DescriptionDisplay
        :config="study.config"
      />
      <EffectDisplay
        br
        :config="study.config"
      />
    </span>
  </CelestialStudyButton>
</template>

<style scoped>

</style>