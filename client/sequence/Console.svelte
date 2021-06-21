<script>
	import { afterUpdate } from 'svelte'

	export let socket

	let textarea
	let infoContent = ''

	socket.on('info', msg => {
		infoContent !== '' ? (infoContent += `\n${msg}`) : (infoContent = msg)
	})

	afterUpdate(() => {
		textarea.scrollTop = textarea.scrollHeight
	})
</script>

<textarea bind:this={textarea} value={infoContent} disabled />

<style>
	textarea {
		width: 600px;
		height: 400px;
		margin: 1rem;
		padding: 0.5rem;
		background-color: #000;
		font-family: 'Fira Code', monospace;
		font-size: 0.8rem;
		color: #fff;
		border-radius: 0.7rem;
	}
	/* textarea::-webkit-scrollbar {
		display: none;
	} */
</style>
