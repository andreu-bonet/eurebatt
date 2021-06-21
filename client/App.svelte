<script>
	import { io } from "socket.io-client";
	import SystemControl from "./SystemControl.svelte";

	const socket = io();
	let wait = false;

	socket.on("wait", () => {
		wait = true;
	});

	socket.on("continue", () => {
		wait = false;
	});
</script>

<app>
	<SystemControl {socket} {wait} />
</app>

<style>
</style>
