<script>
	import Carousel from "$lib/components/carousel/Carousel.svelte";
	import AboutUs from "../lib/components/AboutUs.svelte";
	import Booking from "../lib/components/Booking.svelte";
	import Destination from "../lib/components/Destination.svelte";
	import Packages from "../lib/components/packages/PackageGrid.svelte";
	import Process from "../lib/components/Process.svelte";
	import Team from "../lib/components/Team.svelte";
	import Testimonial from "../lib/components/Testimonial.svelte";

</script>
<Carousel/>
<!-- <Hero /> -->
<AboutUs />
<Destination />
<Packages limit={3} />
<Booking/>
<!-- <Team/> -->
