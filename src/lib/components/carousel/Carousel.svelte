<script lang="ts">
	import { onMount } from 'svelte';
	import CarouselItem from './_components/carouselItem.svelte';
	import AppService from '$lib/services/AppServices';
	import type { Carousel } from '$lib/constant/interfaces';

	let items: Carousel[] = [];
	let loading = true;

	async function loadCarouselItems() {
		try {
			items = await AppService.getCarousel();
		} catch (err) {
			err = 'Failed to load gallery items';
			const items = [
				{
					image: 'img/carousel/carousel-1.jpg',
					title: 'Discover A Brand Luxurious Hotel',
					subtitle: 'Luxury Living',
					active: true
				},
				{
					image: 'img/carousel/carousel-2.webp',
					title: 'Experience The Best Services',
					subtitle: 'Best Services',
					active: false
				}
				// {
				//     image: "img/carousel-3.webp",
				//     title: "Make Your Tour Memorable And Safe",
				//     subtitle: "Memorable Tour",
				// }
			];

			console.error(err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadCarouselItems();
	});
</script>

<!-- Carousel Start -->
<div class="container-fluid p-0 mb-5">
	<div id="header-carousel" class="carousel slide" data-bs-ride="carousel">
		<div class="carousel-inner">
			{#each items as item}
				<CarouselItem
					image={item.image}
					title={item.title}
					subtitle={item.subtitle}
					active={item.active}
				/>
			{/each}
		</div>
		<button
			class="carousel-control-prev"
			type="button"
			data-bs-target="#header-carousel"
			data-bs-slide="prev"
		>
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Previous</span>
		</button>
		<button
			class="carousel-control-next"
			type="button"
			data-bs-target="#header-carousel"
			data-bs-slide="next"
		>
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Next</span>
		</button>
	</div>
</div>
<!-- Carousel End -->
