<<template>
<div class="mkw-page">
	<ui-container :show-header="true">
		<template #header><fa :icon="faStickyNote"/> {{ $t('title') }}</template>
		<template #func>
			<button :title="$t('title')" @click="choosePage"><fa icon="cog"/></button>
		</template>

		<div class="mkw-page--body">
			<div class="page" v-if="page">
				<x-page :page="page" :key="page.id" :show-footer="false"/>
			</div>
			<p class="empty" v-if="page == null">{{ $t('no-page') }}</p>
		</div>
	</ui-container>
</div>
</template>
<script lang="ts">
import define from '../../../common/define-widget';
import i18n from '../../../i18n';
import XPage from '../components/page/page.vue';
import { url } from '../../../config';
import { faStickyNote } from '@fortawesome/free-regular-svg-icons';

export default define({
	name: 'widget-page',
	props: () => ({
		url: ''
	})
}).extend({
	i18n: i18n('common/views/widgets/page.vue'),

	components: {
		XPage
	},

	data(){
		return {
			page: null,
			pageName: '',
			username: '',
			faStickyNote
		};
	},

	mounted(){
		this.fetch();
	},

	methods: {

		fetch(){
			if(!this.props.url || this.props.url == '') return;

			const data = this.props.url.substring(url.length + 1).split('/');
			this.username = data[0].substring(1);
			this.pageName = data[2];

			this.$root.api('pages/show', {
				name: this.pageName,
				username: this.username,
			}).then(resPage => {
				this.page = resPage;
			});
		},

		choosePage(){
			this.$root.dialog({
				title: this.$t('enter-page-url'),
				input: {
					type: 'url',
					default: this.props.url
				}
			}).then(({ canceled, result: resUrl }) => {
				if(canceled) return;

				const urlRegex = new RegExp('^' + url + '/@{1}\\w+/pages/\\w+' + '$', 'g');

				if(resUrl.match(urlRegex)) {
					this.props.url = resUrl;

					this.save();
					this.fetch();
				}else {
					this.$root.dialog({
						title: this.$t('invalid-url'),
						type: 'error'
					});
				}
			});
		}
	}
});
</script>

<style lang="stylus">
.mkw-page--body
	> .page
		margin 0
		padding 6px 8px
		color var(--text)

		> .iroscrza
			>header
				> .title
					padding 8px 12px
					font-size 16px

			> div
				padding 8px 12px
				font-size 14px

	> .empty
		margin 0
		padding 16px
		text-align center
		color var(--text)
</style>
