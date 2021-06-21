<script>
	import InputLabel from './InputLabel.svelte'
	import InputNumber from './InputNumber.svelte'
	import InputButton from './InputButton.svelte'

	export let socket
	export let command
	export let wait
	export let text
	export let unit
	export let value
	export let min
	export let max
</script>

<inputCustom class:wait>
	<InputLabel {text} />
	<InputNumber {wait} {unit} {min} {max} bind:value />
	<InputButton {socket} {command} {wait} {value} />
</inputCustom>

<style>
	inputCustom {
		display: flex;
		align-items: center;
		margin: 5px;
	}
	.wait {
		opacity: 0.5;
		cursor: wait;
	}
</style>
