<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Booking from '$lib/components/Booking.svelte';
	import BookTour from '$lib/components/BookTour.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import type { Package } from '$lib/constant/interfaces';
	import AppService from '$lib/services/AppServices';
	import { onMount } from 'svelte';
	import PackageSlider from '$lib/components/PackageSlider.svelte';

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

		<PackageSlider images={selectedPackage?.images} />

		<div class="row gy-5 gx-4">
			<div class="col-lg-8 col-sm-6 pt-4 wow fadeInUp" data-wow-delay="0.1s">
				<!-- Details Section with Consistent Design -->
				<div class="position-relative border border-primary pt-5 pb-4 px-4">
					<div
						class="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
						style="width: 80px; height: 80px;"
					>
						<i class="fa fa-info fa-2x text-white"></i>
					</div>
					<h5 class="mt-4 text-center">Package Details</h5>
					<hr class="w-25 mx-auto bg-primary mb-1" />
					<hr class="w-50 mx-auto bg-primary mt-0" />

					<!-- Full Description -->
					<div class="detail-section mt-4">
						<div class="d-flex align-items-start p-3 bg-light rounded mb-3">
							<i class="fa fa-file-alt text-primary me-3 mt-1"></i>
							<div class="flex-grow-1">
								<h6 class="fw-semibold mb-2">Full Description</h6>
								<p class="mb-0 text-dark">{selectedPackage?.fullDescription}</p>
							</div>
						</div>
					</div>

					<!-- Highlights -->
					<div class="detail-section">
						<div class="d-flex align-items-start p-3 bg-white border rounded mb-3">
							<i class="fa fa-star text-primary me-3 mt-1"></i>
							<div class="flex-grow-1">
								<h6 class="fw-semibold mb-2">Highlights</h6>
								<ul class="list-unstyled mb-0">
									{#each highlights as item, index}
										<li class="mb-1">
											<i class="fa fa-check text-success me-2"></i>
											{item}
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>

					<!-- Includes -->
					<div class="detail-section">
						<div class="d-flex align-items-start p-3 bg-light rounded mb-3">
							<i class="fa fa-check-circle text-primary me-3 mt-1"></i>
							<div class="flex-grow-1">
								<h6 class="fw-semibold mb-2">What's Included</h6>
								<ul class="list-unstyled mb-0">
									{#each includes as item, index}
										<li class="mb-1">
											<i class="fa fa-plus text-success me-2"></i>
											{item}
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>

					<!-- Excludes -->
					<div class="detail-section">
						<div class="d-flex align-items-start p-3 bg-white border rounded mb-3">
							<i class="fa fa-times-circle text-primary me-3 mt-1"></i>
							<div class="flex-grow-1">
								<h6 class="fw-semibold mb-2">What's Excluded</h6>
								<ul class="list-unstyled mb-0">
									{#each excludes as item, index}
										<li class="mb-1">
											<i class="fa fa-minus text-danger me-2"></i>
											{item}
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>

					<!-- Price Section -->
					<div class="detail-section">
						<div class="d-flex align-items-start p-3 bg-light rounded mb-3">
							<i class="fa fa-tag text-primary me-3 mt-1"></i>
							<div class="flex-grow-1">
								<h6 class="fw-semibold mb-3">Package Price</h6>

								<!-- With Transfer -->
								<div
									class="d-flex justify-content-between align-items-center p-3 bg-white rounded mb-2"
								>
									<div class="d-flex align-items-center">
										<i class="fa fa-car text-primary me-3"></i>
										<div>
											<div class="fw-semibold">With Transfer</div>
											<small class="text-muted">Includes transportation service</small>
										</div>
									</div>
									<div class="text-end">
										<div class="h4 text-primary mb-0">${selectedPackage?.priceWithTransfer}</div>
									</div>
								</div>

								<!-- Without Transfer -->
								<div
									class="d-flex justify-content-between align-items-center p-3 bg-white border rounded"
								>
									<div class="d-flex align-items-center">
										<i class="fa fa-user text-muted me-3"></i>
										<div>
											<div class="fw-semibold">Without Transfer</div>
											<small class="text-muted">Self transportation</small>
										</div>
									</div>
									<div class="text-end">
										<div class="h4 text-dark mb-0">${selectedPackage?.priceWithoutTransfer}</div>
									</div>
								</div>
							</div>
						</div>
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
