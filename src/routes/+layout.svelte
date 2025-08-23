<script lang="ts">
	import '../app.css';
	import Footer from '../lib/components/Layout/Footer.svelte';
	import Navbar from '../lib/components/Layout/Navbar.svelte';
	import Topbar from '../lib/components/Layout/Topbar.svelte';

	let { children } = $props();
</script>

<div class="app">
	<Topbar />
	<Navbar />

	<main>
		{@render children()}
	</main>

	<Footer />
</div>
