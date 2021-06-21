<script>
	export let wait;
	export let unit;
	export let value;

	function add() {
		if (wait) return;
		if (unit === "miliseconds") {
			value += 1000;
		} else {
			value++;
		}
	}

	function sub() {
		if (wait) return;
		if (unit === "miliseconds") {
			value -= 1000;
			if (value < 0) value = 0;
		} else {
			value--;
		}
	}
</script>

<inputNumber style="--unit: '{unit}'">
	<div class="wrapper">
		<input type="number" bind:value class:wait disabled={wait} />
		<span class="input-button add" on:click={add} class:wait>+</span>
		<span class="input-button sub" on:click={sub} class:wait>-</span>
	</div>
</inputNumber>

<style>
	input[type="number"]::-webkit-inner-spin-button,
	input[type="number"]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type="number"] {
		-moz-appearance: textfield;
		font-family: "Roboto", sans-serif;
	}
	.wrapper {
		position: relative;
		height: 54px;
		width: 200px;
		margin: 0 10px;
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
