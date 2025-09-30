<script>
	export let path;
</script>

<!-- src/lib/components/Hero.svelte -->
<div
	class="container-fluid bg-primary py-5 mb-5 hero-header"
	style="	background:
		linear-gradient(rgba(20, 20, 31, 0.7), rgba(20, 20, 31, 0.7)), url(../img/bg-hero.jpg) no-repeat center center/cover;"
>
	<div class="container py-5">
		<div class="row justify-content-center py-5">
			<div class="col-lg-10 pt-lg-5 mt-lg-5 text-center">
				<!-- Breadcrumb / Directory -->
				<nav aria-label="breadcrumb" class="mb-3 animated slideInDown">
					<ol class="breadcrumb justify-content-center">
						<li class="breadcrumb-item">
							<a href="/" class="text-white text-decoration-none">Home</a>
						</li>
						<li class="breadcrumb-item active text-white" aria-current="page">
							{path}
						</li>
					</ol>
				</nav>

				<!-- Title -->
				<h1 class="display-3 text-white mb-3 animated slideInDown">Enjoy Your Vacation With Us</h1>

				<!-- Subtitle -->
				<p class="fs-4 text-white mb-4 animated slideInDown">
					Discover amazing destinations and unforgettable experiences.
				</p>
			</div>
		</div>
	</div>
</div>
