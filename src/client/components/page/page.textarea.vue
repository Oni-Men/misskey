<template>
<MkTextarea :value="text" readonly></MkTextarea>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MkTextarea from '../ui/textarea.vue';

export default defineComponent({
	components: {
		MkTextarea
	},
	props: {
		value: {
			required: true
		},
		script: {
			required: true
		}
	},
	data() {
		return {
			text: this.script.interpolate(this.value.text),
		};
	},
	watch: {
		'script.vars': {
			handler() {
				this.text = this.script.interpolate(this.value.text);
			},
			deep: true
		}
	}
});
</script>
