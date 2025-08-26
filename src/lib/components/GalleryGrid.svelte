<script lang="ts">
  import { onMount } from "svelte";
  import Gallery from "svelte-gallery";

  type Image = { src: string };


  let  images: Image[] = [];
  
</script>

<Gallery {images} rowHeight={220} gutter={10} />
