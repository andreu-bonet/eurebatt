<script>
	import InputCustom from './InputCustom.svelte'

	export let socket
	export let wait
</script>

<div class="main">
	<InputCustom
		{socket}
		command={'stirring'}
		{wait}
		text="Stirring time"
		unit="ms"
		value={5000}
		min={1000}
		max={3600000}
	/>
	<InputCustom
		{socket}
		command={'cathode'}
		{wait}
		text="Cathode valve"
		unit="ms"
		value={5000}
		min={1000}
		max={3600000}
	/>
	<InputCustom
		{socket}
		command={'anode'}
		{wait}
		text="Anode valve"
		unit="ms"
		value={5000}
		min={1000}
		max={3600000}
	/>
	<InputCustom
		{socket}
		command={'peristaltic'}
		{wait}
		text="Peristaltic pump"
		unit="ms"
		value={5000}
		min={1000}
		max={3600000}
	/>
	<InputCustom
		{socket}
		command={'syringe'}
		{wait}
		text="Syringe pump"
		unit="steps"
		value={5}
		min={-100000}
		max={100000}
	/>
	<InputCustom
		{socket}
		command={'autosampler'}
		{wait}
		text="Autosampler"
		unit="milimeters"
		value={5}
		min={1}
		max={10}
	/>
	<InputCustom
		{socket}
		command={'autosampler_zeroing'}
		{wait}
		text="Autosampler Zeroing"
		unit="rpm"
		value={7500}
		min={1}
		max={15000}
	/>
</div>

<style>
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
