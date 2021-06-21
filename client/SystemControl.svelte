<script>
	import Title from "./Title.svelte";
	import InputCustom from "./InputCustom.svelte";

	export let socket;
	export let wait;
</script>

<sysyemControl>
	<Title text="System control" />
	<InputCustom
		{socket}
		command={"stiring"}
		{wait}
		text="Stiring time"
		unit="miliseconds"
		value={5000}
	/>
	<InputCustom
		{socket}
		command={"cathode"}
		{wait}
		text="Cathode valve"
		unit="miliseconds"
		value={5000}
	/>
	<InputCustom
		{socket}
		command={"anode"}
		{wait}
		text="Anode valve"
		unit="miliseconds"
		value={5000}
	/>
	<InputCustom
		{socket}
		command={"peristaltic"}
		{wait}
		text="Peristaltic pump"
		unit="miliseconds"
		value={5000}
	/>
	<InputCustom
		{socket}
		command={"syringe"}
		{wait}
		text="Syringe pump"
		unit="milimeters"
		value={5}
	/>
	<InputCustom
		{socket}
		command={"autosampler"}
		{wait}
		text="Autosampler"
		unit="milimeters"
		value={5}
	/>
	<InputCustom
		{socket}
		command={"autosampler_zeroing"}
		{wait}
		text="Autosampler Zeroing"
		unit="milimeters"
		value={5}
	/>
</sysyemControl>

<style>
	sysyemControl {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
