<script>
  import Gallery from 'svelte-gallery';

  const images = [
    { src: 'https://source.unsplash.com/random', width: 600, height: 400 },
    { src: 'https://source.unsplash.com/random', width: 400, height: 600 },
    { src: 'https://source.unsplash.com/random', width: 800, height: 1200 },
    { src: 'https://source.unsplash.com/random', width: 300, height: 200 }
  ];
</script>

<Gallery {images} />