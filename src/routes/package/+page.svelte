<script>
	import Booking from '$lib/components/Booking.svelte';
	import BookTour from '$lib/components/BookTour.svelte';
	import Hero from '$lib/components/Hero.svelte';
</script>

<Hero />
<!-- Process Start -->
<div class="container-xxl py-5">
	<div class="container">
		<div class="text-center pb-4 wow fadeInUp" data-wow-delay="0.1s">
			<h6 class="section-title bg-white text-center text-primary px-3">Package Details</h6>
			<h1 class="mb-5">Stone Town</h1>
		</div>

		<div class="row gy-5 gx-4">
			<div class="col-lg-8 col-sm-6 text-center pt-4 wow fadeInUp" data-wow-delay="0.1s">
				<div class="position-relative border border-primary pt-5 pb-4 px-4">
					<div
						class="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
						style="width: 100px; height: 100px;"
					>
						<i class="fa fa-info fa-3x text-white"></i>
					</div>
					<h5 class="mt-4">Details</h5>
					<hr class="w-25 mx-auto bg-primary mb-1" />
					<hr class="w-50 mx-auto bg-primary mt-0" />
					<p class="mb-0">
						Tempor erat elitr rebum clita dolor diam ipsum sit diam amet diam eos erat ipsum et
						lorem et sit sed stet lorem sit
					</p>
				</div>

			</div>
			<div class="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp" data-wow-delay="0.1s">
				<div class="booking p-5">
					<BookTour />
				</div>
			</div>
		</div>
	</div>
</div>
<!-- Process Start -->
