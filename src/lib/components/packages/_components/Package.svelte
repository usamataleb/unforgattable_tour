
<script>
	export let name;
	export let price;
	export let location ;
	export let description;
</script>

<div class="package-item position-relative">
	<div class="overflow-hidden position-relative">
		<img class="img-fluid" src="img/package-2.jpg" alt="" />

		<div class="bg-white text-primary fw-bold position-absolute top-0 end-0 m-3 py-1 px-2">
			{price}
		</div>
	</div>

	<div class="d-flex border-bottom">
		<small class="flex-fill text-center border-end py-2">
			<i class="fa fa-map-marker-alt text-primary me-2"></i>{location}
		</small>
	</div>

	<div class="text-center p-4">
		<h5>{name}</h5>
		<hr class="w-25 mx-auto bg-primary mb-1" />
		<hr class="w-50 mx-auto bg-primary mt-0" />
		<p>{description}</p>

		<div class="d-flex justify-content-center mb-2">
			<a
				href="/package"
				class="btn btn-sm btn-primary px-3 border-end"
				style="border-radius: 30px 0 0 30px;">Read More</a
			>
			<a href="#" class="btn btn-sm btn-primary px-3" style="border-radius: 0 30px 30px 0;"
				>Book Now</a
			>
		</div>
	</div>
</div>
