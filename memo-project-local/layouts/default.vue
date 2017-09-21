<template>
	<v-app light>
		<v-navigation-drawer permanent persistent :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" enable-resize-watcher>
			<v-list>
				<v-list-tile v-for="(item, i) in items" :key="i" @click.stop.prevent="detail(item)">
					<v-list-tile-action>
						<v-icon v-bind:class="{'orange--text':item.id==current.id}" v-html="item.icon"></v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title v-text="item.memo"></v-list-tile-title>
						<v-list-tile-sub-title v-text="item.datetime"></v-list-tile-sub-title>
					</v-list-tile-content>
					<v-list-tile-action>
						<v-icon @click.stop.prevent="remove(item)">delete</v-icon>
					</v-list-tile-action>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>

		<v-toolbar fixed>
			<v-toolbar-title v-text="title"></v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click.stop="rightDrawer = !rightDrawer">
				<v-icon>menu</v-icon>
			</v-btn>
		</v-toolbar>

		<main>
			<v-container fluid>
				<v-layout row wrap>
					<v-flex d-flex xs12>
						<v-card>
							<v-text-field @blur="save" placeholder="새로운 메모를 입력해보세요!" full-width rows="15" v-model="current.memo" textarea></v-text-field>

							<v-card-text>
								<v-btn class="pink" dark absolute bottom right fab @click="reset">
									<v-icon>add</v-icon>
								</v-btn>
							</v-card-text>
						</v-card>
					</v-flex>
				</v-layout>
			</v-container>
		</main>

		<v-footer :fixed="fixed">
			<span>&copy; 2017</span>
		</v-footer>
	</v-app>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'

export default {
	data() {
		return {
			clipped: false,
			drawer: true,
			fixed: true,
			items: {
				aa: {
					id: 'aa',
					memo: 'Welcome',
					icon: 'label',
					datetime: '2017.09.14 00:00:00'
				},
				bb: {
					id: 'bb',
					memo: 'Inspire',
					icon: 'label',
					datetime: '2017.09.14 00:10:00'
				}
			},
			current: { memo: '' },
			miniVariant: false,
			title: '메모앱'
		}
	},
	methods: {
		remove(i) {
			Vue.delete(this.items, i.id)
			this.reset()
		},
		save() {
			if (this.current.id || !this.current.memo) return;
			const id = moment().format('YYYYMMDDHHmmssSSS')
			Vue.set(this.items, id, {
				"icon": "label",
				"id": id,
				"memo": this.current.memo,
				"datetime": moment().format('YYYY.MM.DD HH:mm:ss')
			})
			this.reset()
		},
		reset() {
			this.current = { memo: '' };
		},
		detail(i) {
			this.current = i
		}
	}
}
</script>
