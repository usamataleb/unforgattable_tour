<script lang="ts">
	import type { Package } from '$lib/constant/interfaces';
	import { onMount } from 'svelte';
	import Packages from './_components/Package.svelte';
	import AppService from '$lib/services/AppServices';

	let packages: Package[] = [];
	let loading = true;

	onMount(async () => {
		const response = AppService.getWebsitePackages();
		packages = await response;
		loading = false;
	});

	export let limit = 1000;
	export let showReadMore: boolean = false;
</script>

{#if loading}
	<div class="loading-overlay">
		<div class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>
{/if}

{#if !loading && packages.length === 0}
	<p class="text-center">No packages available.</p>
{/if}
<!-- Package Start -->
<div class="container-xxl py-5">
	<div class="container">
		<div class="text-center wow fadeInUp" data-wow-delay="0.1s">
			<h6 class="section-title bg-white text-center text-primary px-3">Packages</h6>
			<h1 class="mb-5">Awesome Packages</h1>
		</div>
		<div class="row g-4">
			{#each packages as pkg, key}
				{#if !(key >= limit)}
					<div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
						<Packages
							id={pkg.id}
							name={pkg.name}
							image={pkg.src}
							price={pkg.priceWithTransfer}
							location={pkg.location}
							description={pkg.description}
						/>
					</div>
				{/if}
			{/each}
		</div>

		{#if showReadMore}
			<div class="text-center">
				<a class="btn btn-primary py-3 px-5 mt-5" href="/packages">Show More Packages</a>
			</div>
		{/if}
	</div>
</div>
<!-- Package End -->
