<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Layout/Footer.svelte';
	import Navbar from '$lib/components/Layout/Navbar.svelte';
	import Topbar from '$lib/components/Layout/Topbar.svelte';
</script>

<div class="app">
	<Topbar />
	<Navbar />
	<main>
		<slot />
	</main>

	<Footer />
</div>

