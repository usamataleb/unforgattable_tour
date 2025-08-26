<script>
	import Packages from './_components/Package.svelte';

	const packages = [
		{
			name: 'Tour & Safari',
			price: '$139.00',
			location: 'Zanzibar',
			description: 'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam eos'
		},
		{
			name: 'Tour & Safari',
			price: '$139.00',
			location: 'Zanzibar',
			description: 'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam eos'
		},
		{
			name: 'Tour & Safari',
			price: '$139.00',
			location: 'Zanzibar',
			description: 'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam eos'
		},
		{
			name: 'Tour & Safari',
			price: '$139.00',
			location: 'Zanzibar',
			description: 'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam eos'
		},
		{
			name: 'Tour & Safari',
			price: '$139.00',
			location: 'Zanzibar',
			description: 'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam eos'
		}
	];
	export let limit;
</script>

<!-- Package Start -->
<div class="container-xxl py-5">
	<div class="container">
		<div class="text-center wow fadeInUp" data-wow-delay="0.1s">
			<h6 class="section-title bg-white text-center text-primary px-3">Packages</h6>
			<h1 class="mb-5">Awesome Packages</h1>
		</div>
		<div class="row g-4 ">
			{#each packages as pkg, key}
				{#if !(key >= limit)}
					<div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
						<Packages
							name={pkg.name}
							price={pkg.price}
							location={pkg.location}
							description={pkg.description}
						/>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
<!-- Package End -->
