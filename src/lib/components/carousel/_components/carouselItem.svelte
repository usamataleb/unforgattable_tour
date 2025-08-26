<script>
  export let image;
  export let title;
  export let subtitle;
  export let active;
</script>

<div class="carousel-item" class:active={active}>
  <img class="w-100" height="1000" src={image} alt={title} />
  <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
    <div class="p-3" style="max-width: 700px;">
      <h6 class="section-title text-white text-uppercase mb-3 animated slideInDown">
        {subtitle}
      </h6>
      <h1 class="display-3 text-white mb-4 animated slideInDown">
        {title}
      </h1>
      <a href="./packages" class="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">
        Our Packages
      </a>
      <a href="./booking" class="btn btn-light py-md-3 px-md-5 animated slideInRight">
        Book Package
      </a>
    </div>
  </div>
</div>
