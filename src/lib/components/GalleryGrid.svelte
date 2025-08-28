<script lang="ts">
	import type { Image } from '$lib/constant/interfaces';
	import AppService from '$lib/services/AppServices';
	import { onMount } from 'svelte';

	let images: Image[] = [];
	let error = '';
	let loading = true;

	let lightboxOpen = false;
	let activeIndex: number = 0;

	async function loadGalleryImages() {
		loading = true;
		try {
			images = await AppService.getWebsiteGallery();
		} catch (err) {
			error = 'Failed to load gallery items';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	function openLightbox(index: number) {
		activeIndex = index;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function nextImage() {
		activeIndex = (activeIndex + 1) % images.length;
	}

	function prevImage() {
		activeIndex = (activeIndex - 1 + images.length) % images.length;
	}

	onMount(loadGalleryImages);
</script>

{#if loading}
	<p>Loading gallery...</p>
{:else if error}a
	<p>{error}</p>
{:else if images.length > 0}
	<div class="container-xxl py-5">
		<div class="container">
			<div class="text-center wow fadeInUp" data-wow-delay="0.1s">
				<h6 class="section-title bg-white text-center text-primary px-3">Gallery</h6>
				<h1 class="mb-5">Our Gallery</h1>
			</div>
			<div class="grid">
				{#each images as img, i}
					<div
						class="item {i % 2 === 0 ? 'item--large' : ''} {i % 3 === 0 ? 'item--medium' : ''}"
						style="background-image: url({img.src});"
						on:click={() => openLightbox(i)}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								openLightbox(i);
							}
						}}
					>
						<div class="item__details">
							{#if img.width && img.height}
								{img.width} × {img.height}
							{:else}
								Image
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	{#if lightboxOpen}
		<div class="lightbox">
			<button class="close" on:click={closeLightbox}>×</button>
			<button class="nav prev" on:click={prevImage}>‹</button>
			<img src={images[activeIndex].src} alt="lightbox" />
			<button class="nav next" on:click={nextImage}>›</button>
		</div>
	{/if}
{:else}
	<p>No images found</p>
{/if}
