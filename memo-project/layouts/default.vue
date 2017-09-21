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
			<v-btn icon v-if="user.uid" @click="logout">
				<v-avatar>
					<img :src="user.photoURL" :alt="user.displayName" />
				</v-avatar>
			</v-btn>
		</v-toolbar>

		<main>
			<v-container fluid>
				<v-layout row wrap>
					<v-flex d-flex xs12>
						<v-card v-if="user.uid">
							<v-text-field @blur="save" placeholder="새로운 메모를 입력해보세요!" full-width rows="15" v-model="current.memo" textarea></v-text-field>

							<v-card-text>
								<v-btn class="pink" dark absolute bottom right fab @click="reset">
									<v-icon>add</v-icon>
								</v-btn>
							</v-card-text>
						</v-card>
						<v-card v-if="!user.uid">
							<v-btn large @click="login">
								Login
								<v-icon>assignment_ind</v-icon>
							</v-btn>
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
import firebase from '../lib/firebase'

export default {
	data() {
		return {
			clipped: false,
			drawer: true,
			fixed: true,
			items: {},
			current: { memo: '' },
			user: {},
			miniVariant: false,
			title: '메모앱'
		}
	},
	methods: {
		login() {
			firebase.auth.signInWithPopup(firebase.provider)
		},
		logout() {
			this.user = {}
			firebase.auth.signOut();
		},
		remove(i) {
			firebase.db.ref('notes/' + this.user.uid + '/' + i.id).remove()
			this.reset()
		},
		save() {
			if (!this.current.memo) return

			let key = 'notes/' + this.user.uid;
			let data;
			if (!this.current.id) {
				const id = moment().format('YYYYMMDDHHmmssSSS')
				key += '/' + id
				data = {
					"icon": "label",
					"id": id,
					"memo": this.current.memo,
					"datetime": moment().format('YYYY.MM.DD HH:mm:ss')
				}
			} else {
				key += '/' + this.current.id
			}
			firebase.db.ref(key).set(data || this.current);
			this.reset()
		},
		reset() {
			this.current = { memo: '' };
		},
		detail(i) {
			this.current = i
		}
	},
	created() {
		const self = this;
		firebase.auth.onAuthStateChanged((u) => {
			if (!u || !u.uid) return self.user = {};
			self.user = u;

			const key = 'notes/' + self.user.uid
			firebase.db.ref(key).off('value');
			firebase.db.ref(key).orderByKey().on('value', (snapshot) => {
				self.items = snapshot.val();
			});
		})
	}
}
</script>
