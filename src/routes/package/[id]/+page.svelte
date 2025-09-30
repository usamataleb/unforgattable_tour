<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Booking from '$lib/components/Booking.svelte';
	import BookTour from '$lib/components/BookTour.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import type { Package } from '$lib/constant/interfaces';
	import AppService from '$lib/services/AppServices';
	import { onMount } from 'svelte';
	import PackageSlider from '../_components/PackageSlider.svelte';

	let packageId = $page.params.id;
	let packages: Package[] = [];
	let selectedPackage: Package | undefined;

	// Arrays for split data
	let highlights: string[] = [];
	let includes: string[] = [];
	let excludes: string[] = [];

	onMount(async () => {
		const response = AppService.getWebsitePackages();
		packages = await response;

		if (packageId === undefined || isNaN(parseInt(packageId))) {
			goto('/packages');
		}

		const id = parseInt($page.params.id as string);
		selectedPackage = packages.find((pkg) => pkg.id === id);

		if (selectedPackage) {
			highlights = selectedPackage.highlights
				? selectedPackage.highlights.split(',').map((s) => s.trim())
				: [];
			includes = selectedPackage.includes
				? selectedPackage.includes.split(',').map((s) => s.trim())
				: [];
			excludes = selectedPackage.excludes
				? selectedPackage.excludes.split(',').map((s) => s.trim())
				: [];
		}
	});
</script>

<Hero path="Package / {selectedPackage?.name}" />
<!-- Process Start -->
<div class="container-xxl">
	<div class="container">
		<div class="text-center pb-4 wow fadeInUp mt-3" data-wow-delay="0.1s">
			<h6 class="section-title bg-white text-center text-primary px-3">Package Details</h6>
			<h1 class="mb-5">{selectedPackage?.name}</h1>
		</div>

		<PackageSlider />

		<div class="row gy-5 gx-4">
			<div class="col-lg-8 col-sm-6 pt-4 wow fadeInUp" data-wow-delay="0.1s">
				<div class="position-relative border border-primary pt-5 pb-4 px-4">
					<div
						class="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
						style="width: 100px; height: 100px;"
					>
						<i class="fa fa-info fa-3x text-white"></i>
					</div>
					<h5 class="mt-4 text-center">Details</h5>
					<hr class="w-25 mx-auto bg-primary mb-1" />
					<hr class="w-50 mx-auto bg-primary mt-0" />

					<!-- Full Description -->
					<h6 class="mt-3">Full Description</h6>
					<p class="mb-3">{selectedPackage?.description}</p>

					<!-- Highlight -->
					<h6>Highlights</h6>
					<ul class="mb-3">
						{#each highlights as item, index}
							<li>{item}</li>
						{/each}
					</ul>

					<!-- Includes -->
					<h6>Includes</h6>
					<ul class="mb-3">
						{#each includes as item, index}
							<li>{item}</li>
						{/each}
					</ul>

					<!-- Excludes -->
					<h6>Excludes</h6>
					<ul class="mb-3">
						{#each excludes as item, index}
							<li>{item}</li>
						{/each}
					</ul>

					<!-- Price -->
					<h6>Price</h6>
					<div class="mb-2">
						<strong>With Transfer:</strong>
						{selectedPackage?.priceWithTransfer}
					</div>
					<div class="mb-2">
						<strong>Without Transfer:</strong>
						{selectedPackage?.priceWithoutTransfer}
					</div>
				</div>
			</div>

			<div class="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp" data-wow-delay="0.1s">
				<div
					class="booking p-5"
					style="	background:
						linear-gradient(rgba(15, 23, 43, 0.7), rgba(15, 23, 43, 0.7)), url(../img/booking.webp) ;"
				>
					<BookTour packageName={selectedPackage?.name} />
				</div>
			</div>
		</div>
	</div>
</div>
<!-- Process End -->
