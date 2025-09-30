<script>
  export let title = "Unforgettable Tour and Travel - East Africa DMC on Zanzibar";
  export let description = "Zanzibar's premier Destination Management Company with over 25 years of experience creating unforgettable travel experiences in East Africa.";
  export let keywords = "Zanzibar tours, Tanzania safaris, East Africa travel, spice island tours, beach holidays, cultural experiences";
  export let ogImage = "%sveltekit.assets%/images/og-default.jpg";
  export let ogType = "website";
  export let canonicalUrl = "";
  export let twitterCard = "summary_large_image";
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />

  <!-- Twitter -->
  <meta property="twitter:card" content={twitterCard} />
  <meta property="twitter:url" content={canonicalUrl} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={ogImage} />

  <!-- Canonical URL -->
  {#if canonicalUrl}
    <link rel="canonical" href={canonicalUrl} />
  {/if}
</svelte:head>