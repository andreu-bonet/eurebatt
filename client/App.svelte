<script>
	import { io } from 'socket.io-client'
	import Header from './Header.svelte'
	import SeqControl from './sequence/Index.svelte'
	import SysControl from './system/Index.svelte'

	const socket = io()
	let wait = false
	let view = 1

	socket.on('wait', () => {
		wait = true
	})

	socket.on('continue', () => {
		wait = false
	})
</script>

<app>
	<Header bind:view />
	{#if view === 1}
		<SysControl {socket} {wait} />
	{:else if view === 2}
		<SeqControl {socket} {wait} />
	{/if}
</app>

<style>
	app {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
