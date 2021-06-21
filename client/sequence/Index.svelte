<script>
	import Input from './Input.svelte'
	import Console from './Console.svelte'

	export let socket
	export let wait

	let seqs = [
		{
			repetitions: {
				label: 'Repetitions',
				type: 'number',
				unit: 'time',
				step: 1,
				precision: 1,
				key: 'repetitions',
				value: 3,
				min: 1,
				max: 12
			},
			duration: {
				label: 'Duration',
				type: 'number',
				unit: 'minute',
				step: 1,
				precision: 10,
				key: 'duration',
				value: 1,
				min: 0,
				max: 1440
			},
			stirring: {
				label: 'Stirring',
				type: 'boolean',
				unit: 'boolean',
				key: 'stirring',
				value: true
			},
			stirring_speed: {
				label: 'Stirring Speed',
				type: 'number',
				unit: 'rpm',
				step: 5,
				precision: 1,
				key: 'stirring_rpm',
				value: 75,
				min: 10,
				max: 150
			},
			potential: {
				label: 'Potential',
				type: 'number',
				unit: 'volt',
				step: 1,
				precision: 10,
				key: 'potential',
				value: -1.2,
				min: -20,
				max: 20
			},
			interval: {
				label: 'Measure Resolution',
				type: 'number',
				unit: 'second',
				step: 1,
				precision: 10,
				key: 'interval',
				value: 0.5,
				min: 0.1,
				max: 10
			},
			cleaning_cycles: {
				label: 'Cleaning Cycles',
				type: 'number',
				unit: 'time',
				step: 1,
				precision: 1,
				key: 'cleaning_cycles',
				value: 3,
				min: 0,
				max: 10
			},
			cleaning_duration: {
				label: 'Cleaning Duration',
				type: 'number',
				unit: 'second',
				step: 1,
				precision: 1,
				key: 'cleaning_duration',
				value: 10,
				min: 0,
				max: 60
			}
		}
	]

	function addSequence(idx) {
		const totalRepetitions = seqs.reduce(
			(total, seq) => total + seq.repetitions.value,
			0
		)
		if (totalRepetitions === 12) return
		const seqClone = JSON.parse(JSON.stringify(seqs[idx]))
		const remainderTotalRepetitions = 12 - totalRepetitions
		seqClone.repetitions.value =
			remainderTotalRepetitions < 3 ? remainderTotalRepetitions : 3
		seqs = [...seqs, seqClone]
	}

	function subSequence(idx) {
		seqs = [...seqs.slice(0, idx), ...seqs.slice(idx + 1)]
	}

	function upSequence(idx) {
		;[seqs[idx - 1], seqs[idx]] = [seqs[idx], seqs[idx - 1]]
	}

	function downSequence(idx) {
		;[seqs[idx + 1], seqs[idx]] = [seqs[idx], seqs[idx + 1]]
	}

	function sendSequence() {
		const data = seqs.map(seq =>
			Object.values(seq).reduce((data, item) => {
				data[item.key] = item.value
				return data
			}, {})
		)
		socket.emit('sequence', data)
	}
</script>

<div class="main">
	<div class="labels">
		{#each Object.values(seqs[0]) as vals}
			<span class="label">{vals.label}</span>
		{/each}
		<span class="label">Add Move Remove</span>
	</div>
	{#each seqs as seq, idx}
		<div class="sequence">
			{#each Object.keys(seq) as key}
				<Input
					{wait}
					{seqs}
					{key}
					type={seq[key].type}
					unit={seq[key].unit}
					step={seq[key].step}
					precision={seq[key].precision}
					bind:value={seq[key].value}
					min={seq[key].min}
					max={seq[key].max}
				/>
			{/each}
			<div class="buttons">
				<button
					class:v-hidden={seqs.length === 1}
					on:click={() => {
						subSequence(idx)
					}}>❌</button
				>
				<button
					on:click={() => {
						addSequence(idx)
					}}>➕</button
				>
			</div>
			<div class="buttons">
				<button
					class:v-hidden={idx === 0}
					on:click={() => {
						upSequence(idx)
					}}>▲</button
				>
				<button
					class:v-hidden={idx === seqs.length - 1}
					on:click={() => {
						downSequence(idx)
					}}>▼</button
				>
			</div>
		</div>
	{/each}
	<button class="start" on:click={sendSequence} class:wait disabled={wait}>
		Start Sequences
	</button>
	<Console {socket} />
</div>

<style>
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.wait {
		cursor: wait;
	}

	.labels {
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.labels .label {
		display: block;
		font-weight: bold;
		width: 135px;
		padding: 0 1rem;
		margin: 0 0.25rem;
		text-align: center;
	}

	.sequence .buttons {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.v-hidden {
		visibility: hidden;
	}

	.sequence .buttons {
		margin-right: 1px;
	}

	.sequence .buttons button {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		width: 60px;
		height: 26px;
		border: 1px solid #e3e3e3;
		color: #434343;
		background: #fff;
		text-align: center;
		cursor: pointer;
		border-radius: 4px;
		margin-bottom: 1px;
	}

	.sequence .buttons button:disabled {
		color: #e3e3e3;
		cursor: default;
	}

	.sequence .buttons button:not([disabled]):hover {
		background: #fafafa;
	}

	.sequence {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 1rem;
	}

	.start {
		margin-top: 1rem;
		padding: 0 1rem;
		height: 54px;
		background: #ffffff;
		border: 1px solid #e3e3e3;
		border-radius: 4px;
		font-size: 20px;
		text-align: center;
		font-weight: bold;
		cursor: pointer;
	}

	.start:hover {
		cursor: pointer;
		background-color: #fafafa;
	}
</style>
