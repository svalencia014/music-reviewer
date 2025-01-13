<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/ixon" href="/favicon.png"/>
</svelte:head>

<Navbar canViewAdmin={true}/>
{@render children()}
