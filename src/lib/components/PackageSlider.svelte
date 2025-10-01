<script lang="ts">
	import type { PackageImage } from '$lib/constant/interfaces';
  import { onMount, onDestroy } from 'svelte';
  

  export let images: PackageImage[] = [];

  let currentIndex: number = 0;
  let isAnimating: boolean = false;
  let intervalId: ReturnType<typeof setInterval> | undefined;

  // Responsive slides to show
  let slidesToShow: number = 3;
  let windowWidth: number = 0;

  $: {
    if (windowWidth < 768) {
      slidesToShow = 1;
    } else if (windowWidth < 1024) {
      slidesToShow = 2;
    } else {
      slidesToShow = 3;
    }
  }

  $: maxIndex = Math.max(0, images.length - slidesToShow);
  $: hasMultipleSlides = images.length > slidesToShow;

  function nextSlide(): void {
    if (isAnimating || !hasMultipleSlides) return;
    isAnimating = true;
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    setTimeout(() => { isAnimating = false; }, 500);
  }

  function prevSlide(): void {
    if (isAnimating || !hasMultipleSlides) return;
    isAnimating = true;
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    setTimeout(() => { isAnimating = false; }, 500);
  }

  function goToSlide(index: number): void {
    if (isAnimating || !hasMultipleSlides) return;
    isAnimating = true;
    currentIndex = index;
    setTimeout(() => { isAnimating = false; }, 500);
  }

  function handleResize(): void {
    windowWidth = window.innerWidth;
  }

  onMount(() => {
    windowWidth = window.innerWidth;
    window.addEventListener('resize', handleResize);
    
    if (hasMultipleSlides) {
      intervalId = setInterval(nextSlide, 4000);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });
</script>

{#if images.length > 0}
  <div class="wrapper">
    <div class="slider-container">
      <!-- Slides Container -->
      <div class="overflow">
        <div 
          class="slides-wrapper" 
          style="transform: translateX(-{currentIndex * (100 / slidesToShow)}%)"
        >
          {#each images as image}
            <div class="slide">
              <div class="image-container">
                <img 
                  src={image.src} 
                  alt="Package image {image.id}" 
                  loading="lazy"
                />
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Navigation Arrows - Only show if multiple slides -->
      {#if hasMultipleSlides}
        <button class="nav-btn prev" on:click={prevSlide} aria-label="Previous slides">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <button class="nav-btn next" on:click={nextSlide} aria-label="Next slides">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      {/if}
    </div>

    <!-- Dot Indicators - Only show if multiple slide groups -->
    {#if hasMultipleSlides && maxIndex > 0}
      <div class="dots">
        {#each Array(maxIndex + 1) as _, index}
          <button
            class="dot"
            class:active={index === currentIndex}
            on:click={() => goToSlide(index)}
            aria-label="Go to slide group {index + 1}"
          />
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div class="no-images">
    <p>No images available for this package.</p>
  </div>
{/if}

<style>
  .wrapper {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
  }

  .slider-container {
    position: relative;
  }

  .overflow {
    overflow: hidden;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .slides-wrapper {
    display: flex;
    transition: transform 500ms ease-out;
  }

  .slide {
    min-width: 33.333%;
    padding: 0 0.5rem;
    box-sizing: border-box;
  }

  .image-container {
    position: relative;
    height: 400px;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    background: #f3f4f6;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 300ms;
  }

  .image-container:hover img {
    transform: scale(1.05);
  }

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    color: #1f2937;
    border: none;
    border-radius: 50%;
    padding: 0.75rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 200ms;
    z-index: 10;
  }

  .nav-btn:hover {
    background: #f9fafb;
    transform: translateY(-50%) scale(1.1);
  }

  .nav-btn:active {
    transform: translateY(-50%) scale(0.95);
  }

  .nav-btn.prev {
    left: -1rem;
  }

  .nav-btn.next {
    right: -1rem;
  }

  .dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
  }

  .dot {
    border: none;
    border-radius: 9999px;
    width: 0.75rem;
    height: 0.75rem;
    background: #ffdc00;
    cursor: pointer;
    transition: all 200ms;
    padding: 0;
  }

  .dot:hover {
    background: #9ca3af;
  }

  .dot.active {
    background: #f57921;
    width: 2.5rem;
  }

  .no-images {
    text-align: center;
    padding: 3rem;
    background: #f9fafb;
    border-radius: 1rem;
    color: #6b7280;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    .slide {
      min-width: 50%;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .slide {
      min-width: 100%;
      padding: 0;
    }

    .image-container {
      height: 300px;
      border-radius: 0.5rem;
    }

    .nav-btn {
      padding: 0.5rem;
    }

    .nav-btn.prev {
      left: 0.5rem;
    }

    .nav-btn.next {
      right: 0.5rem;
    }

    .dots {
      margin-top: 1rem;
    }
  }
</style>