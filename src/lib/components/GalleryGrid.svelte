<script lang="ts">
	import type { Image } from '$lib/constant/interfaces';
	import AppService from '$lib/services/AppServices';
	import { onMount } from 'svelte';
	import Gallery from 'svelte-gallery';

	let images: Image[] = [];
	let error = '';
	let loading = true;

	async function loadGalleryImages() {
		loading = true;
		try {
			images = await AppService.getWebsiteGallery();

			console.log('Gallery images loaded:', images);
		} catch (err) {
			error = 'Failed to load carousel items';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		await loadGalleryImages();
	});

</script>

{#if images.length > 0}

	<Gallery {images} rowHeight={220} gutter={10} />
{:else}
	<p>No images found</p>
{/if}
