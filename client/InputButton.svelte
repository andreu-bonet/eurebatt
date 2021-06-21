<script>
	export let socket;
	export let command;
	export let wait;
	export let value;
	export let text = "Send";

	function send() {
		socket.emit("command_single", `${command} ${value}`);
	}
</script>

<inputButton>
	<button on:click={send} class:wait disabled={wait}>{text}</button>
</inputButton>

<style>
	button {
		height: 54px;
		padding: 0 20px;
		background: #ffffff;
		border: 1px solid #e3e3e3;
		border-radius: 4px;
		font-size: 20px;
		color: #434343;
		text-align: center;
		font-weight: bold;
		cursor: pointer;
	}
	button:hover {
		background: #fafafa;
	}
	.wait {
		cursor: wait;
	}
</style>
