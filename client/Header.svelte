<script>
	export let view
</script>

<header>
	<button class:selected={view === 1} on:click={() => (view = 1)}>
		System control
	</button>
	<button class:selected={view === 2} on:click={() => (view = 2)}>
		Sequence control
	</button>
</header>

<style>
	header {
		margin: 1rem;
		display: flex;
		width: 620px;
		height: 6vh;
		border: 1px solid #e3e3e3;
		border-radius: 4px;
	}

	button {
		width: 50%;
		font-size: 1.5em;
		font-weight: bold;
		background-color: transparent;
		border: none;
		cursor: pointer;
	}

	button:hover {
		background-color: #fafafa;
	}

	button.selected {
		background-color: #fafafa;
	}
</style>
