<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  interface Slide {
    url: string;
    alt: string;
  }

  let currentIndex: number = 0;
  let isAnimating: boolean = false;
  let intervalId: ReturnType<typeof setInterval> | undefined;

  const slides: Slide[] = [
    {
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop",
      alt: "Person on boat in turquoise waters"
    },
    {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
      alt: "Beach scene with calm waters"
    },
    {
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop",
      alt: "Snorkeling with tropical fish"
    },
    {
      url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=500&fit=crop",
      alt: "Tropical beach paradise"
    },
    {
      url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=500&fit=crop",
      alt: "Crystal clear ocean water"
    },
    {
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop",
      alt: "Beach adventure"
    }
  ];

  const slidesToShow: number = 3;
  $: maxIndex = slides.length - slidesToShow;

  function nextSlide(): void {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    setTimeout(() => { isAnimating = false; }, 500);
  }

  function prevSlide(): void {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    setTimeout(() => { isAnimating = false; }, 500);
  }

  function goToSlide(index: number): void {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex = index;
    setTimeout(() => { isAnimating = false; }, 500);
  }

  onMount(() => {
    intervalId = setInterval(nextSlide, 4000);
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });
</script>

  <div class="wrapper">
    <div class="slider-container">
      <!-- Slides Container -->
      <div class="overflow">
        <div 
          class="slides-wrapper" 
          style="transform: translateX(-{currentIndex * (100 / slidesToShow)}%)"
        >
          {#each slides as slide, index}
            <div class="slide">
              <div class="image-container">
                <img src={slide.url} alt={slide.alt} />
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Navigation Arrows -->
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
    </div>

    <!-- Dot Indicators -->
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

  </div>

<style>

  .wrapper {
    width: 100%;
    max-width: 1280px;
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
  }

  .image-container {
    position: relative;
    height: 400px;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
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
    background:   #ffdc00;
    cursor: pointer;
    transition: all 200ms;
    padding: 0;
  }

  .dot:hover {
    background: #9ca3af;
  }

  .dot.active {
    background:  #f57921;
    width: 2.5rem;
  }


  @media (max-width: 768px) {
    .slide {
      min-width: 100%;
    }

    .image-container {
      height: 300px;
    }
  }
</style>