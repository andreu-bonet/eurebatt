<script>
	export let wait
	export let seqs
	export let key
	export let type
	export let step
	export let precision = 10
	export let unit = ''
	export let value
	export let min
	export let max

	$: boolValue = value ? 'Yes' : 'No'

	function add() {
		if (wait) return
		if (type === 'boolean') {
			value = !value
			return
		}
		if (key === 'repetitions') {
			const totalRepetitions = seqs.reduce(
				(total, seq) => total + seq.repetitions.value,
				0
			)
			if (totalRepetitions === 12) return
		}
		value = parseInt(value * precision + step) / precision
	}

	function sub() {
		if (wait) return
		if (type === 'boolean') {
			value = !value
			return
		}
		value = parseInt(value * precision - step) / precision
	}

	$: value = value > max ? max : value < min ? min : value
</script>

<div
	style="--unit: '{`${unit || ''}${
		['time', 'minute', 'volt', 'second'].includes(unit) && Math.abs(value) !== 1
			? 's'
			: ''
	}`}'"
>
	<div class="wrapper">
		{#if type === 'boolean'}
			<input type="text" bind:value={boolValue} class:wait disabled={wait} />
		{:else}
			<input type="number" bind:value class:wait disabled={wait} />
		{/if}
		<span class="input-button add" on:click={add} class:wait>+</span>
		<span class="input-button sub" on:click={sub} class:wait>-</span>
	</div>
</div>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield;
		font-family: 'Roboto', sans-serif;
	}
	.wrapper {
		position: relative;
		height: 54px;
		width: 135px;
		margin-right: 0.5rem;
	}
	.wrapper::after {
		content: var(--unit);
		position: absolute;
		bottom: 6px;
		left: 0;
		width: calc(100% - 27px);
		text-align: center;
	}
	input {
		height: 54px;
		background: #ffffff;
		border: 1px solid #e3e3e3;
		border-radius: 4px 0 0 4px;
		font-size: 20px;
		color: #434343;
		text-align: center;
		width: calc(100% - 27px);
		font-weight: bold;
		padding-bottom: 20px;
	}
	.input-button {
		position: absolute;
		height: 27px;
		width: 27px;
		border: 1px solid #e3e3e3;
		color: #e3e3e3;
		text-align: center;
		line-height: 27px;
		cursor: pointer;
		user-select: none;
	}
	.input-button:hover {
		background: #fafafa;
	}
	.input-button.add {
		top: 0;
		right: 1px;
		border-radius: 0 4px 0 0;
		border-bottom: none;
	}
	.input-button.sub {
		bottom: 0;
		right: 1px;
		border-radius: 0 0 4px 0;
	}
	.wait {
		cursor: wait;
	}
</style>
