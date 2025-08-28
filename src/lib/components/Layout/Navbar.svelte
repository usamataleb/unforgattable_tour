
<script>

	import { onMount } from "svelte";
	import { page } from "$app/stores";

	let currentPath = "";

	// Subscribe to the page store to get the current path
	const unsubscribe = page.subscribe(($page) => {
		currentPath = $page.url.pathname;
	});

	onMount(() => {
		return () => {
			unsubscribe();
		};
	});

</script>

<!-- Navbar -->
<div class="container-fluid position-relative p-0">
	<nav class="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
		<a href="/" class="navbar-brand p-0">
			<h1 class="text-primary m-0 d-none d-lg-block">
				<img src="./logo.png" alt="" />
				Unforgettable Tours & Safari
			</h1>
			<!-- <img src="img/logo.png" alt="Logo"> -->
		</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarCollapse"
		>
			<span class="fa fa-bars"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarCollapse">
			<div class="navbar-nav ms-auto py-0">
				<a href="/" class="nav-item nav-link" class:active={ currentPath === "/" } >Home</a>
				<a href="about" class="nav-item nav-link" class:active={ currentPath === "/about" }  >About</a>
				<a href="service" class="nav-item nav-link" class:active={ currentPath === "/service" }  >Services</a>
				<a href="gallery" class="nav-item nav-link" class:active={ currentPath === "/gallery" }  >Gallery</a>
				<a href="packages" class="nav-item nav-link" class:active={ currentPath === "/packages" }  >Packages</a>
				<!-- <div class="nav-item dropdown">
					<a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
					<div class="dropdown-menu m-0">
						<a href="destination.html" class="dropdown-item">Destination</a>
						<a href="booking.html" class="dropdown-item">Booking</a>
						<a href="team.html" class="dropdown-item">Travel Guides</a>
						<a href="testimonial.html" class="dropdown-item">Testimonial</a>
						<a href="404.html" class="dropdown-item">404 Page</a>
					</div>
				</div> -->
				<a href="contact" class="nav-item nav-link">Contact</a>
			</div>
			<!-- <a href="" class="btn btn-primary rounded-pill py-2 px-4">Register</a> -->
		</div>
	</nav>
</div>

<!-- Navbar -->
