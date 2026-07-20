<template>
    <svg
      class="svg-icon"
      :width="svgProps.width"
      :height="svgProps.width"
      :fill="svgProps.fill"
      :stroke="svgProps.stroke"
      :stroke-width="svgProps.strokeWidth"
    >
        <use :xlink:href="`#${svgProps.name}`"></use>
    </svg>
</template>

<script >
import { defineComponent, computed } from 'vue';
import IconLibrary from '~/components/shared/IconLibrary.vue';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'medium',
    },
    width: {
      type: Number,
      default: null,
    },
    stroke: {
      type: String,
      default: '#FFF',
    },
    fill: {
      type: String,
      default: '#FFF',
    },
    strokeWidth: {
      type: String,
    },
  },
  setup(props) {
    const sizeMapping = {
      micro: 16,
      small: 24,
      medium: 32,
      large: 48,
    };
    const interpretedSize = computed(() => {
      if (typeof props.size === 'string') {
        return sizeMapping[props.size] || 24;
      }
      return props.size;
    });
    const svgProps = computed(() => ({
      name: props.name,
      width: props.width || interpretedSize.value,
      height: interpretedSize.value,
      fill: props.fill,
      stroke: props.stroke,
      strokeWidth: +props.strokeWidth,
    }));
    const svg = computed(() => IconLibrary[props.name] || null);

    return {
      svg,
      svgProps,
    };
  },
});
</script>