<!-- Booking Start -->
<div class="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
	<div class="container">
		<!-- make Cover Image -->

		<div
			class="booking p-5"
			style="	background:
		linear-gradient(rgba(15, 23, 43, 0.7), rgba(15, 23, 43, 0.7)), url(../img/booking.webp) ;"
		>
			<div class="row g-5 align-items-center">
				<div class="col-md-6 text-white">
					<h6 class="text-white text-uppercase">Booking</h6>
					<h1 class="text-white mb-4">Online Booking</h1>
					<p class="mb-4">
						Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et
						eos. Clita erat ipsum et lorem et sit.
					</p>
					<p class="mb-4">
						Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et
						eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore
						erat amet
					</p>
				</div>
				<div class="col-md-6">
					<h1 class="text-white mb-4">Book A Tour</h1>
					<form action="https://formspree.io/f/mzzadyjj" method="POST" >
						<div class="row g-3">
							<div class="col-md-6">
								<div class="form-floating">
									<input
										type="text"
										class="form-control bg-transparent"
										id="name"
										placeholder="Your Name"
										required
									/>
									<label for="name">Your Name</label>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-floating">
									<input
										type="email"
										class="form-control bg-transparent"
										id="email"
										placeholder="Your Email"
									/>
									<label for="email">Your Email</label>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-floating date" id="date3" data-target-input="nearest">
									<input
										type="date"
										class="form-control bg-transparent datetimepicker-input"
										id="date"
										placeholder="Date & Time"
										data-target="#date3"
										data-toggle="datetimepicker"
										required
									/>
									<label for="date">Date</label>
								</div>
							</div>

							<div class="col-md-6">
								<div class="form-floating date" id="date3" data-target-input="nearest">
									<input
										type="time"
										class="form-control bg-transparent datetimepicker-input"
										id="time"
										name="time"
										placeholder="Date & Time"
										data-target="#date3"
										data-toggle="datetimepicker"
										required
									/>
									<label for="time">Time</label>
								</div>
							</div>

							<div class="col-12">
								<div class="form-floating">
									<input
										type="text"
										class="form-control bg-transparent"
										id="name"
										placeholder="Destination"
										required
									/>

									<label for="select1">Destination</label>
								</div>
							</div>

							<div class="col-md-6">
								<div class="form-floating">
									<select class="form-select bg-transparent" id="select1" required>
										<option value="">Select Language</option>

										<option value="English">English</option>
										<option value="French">French</option>
										<option value="German">German</option>
										<option value="Spanish">Spanish</option>
										<option value="Italian">Italian</option>
										<option value="Swahili">Swahili</option>
										<option value="Arabic">Arabic</option>
									</select>

									<label for="message">Languages</label>
								</div>
							</div>

							<div class="col-6">
								<div class="form-floating">
									<input
										type="text"
										class="form-control bg-transparent"
										id="name"
										name="meetingPoint"
										placeholder="Meeting Point"
										required
									/>

									<label for="select1">Meeting Point</label>
								</div>
							</div>

							<div class="col-12">
								<div class="form-floating">
									<textarea
										class="form-control bg-transparent"
										placeholder="Special Request"
										id="message"
										style="height: 100px"
									></textarea>
									<label for="message">Special Request</label>
								</div>
							</div>
							<div class="col-12">
								<button class="btn btn-outline-light w-100 py-3" type="submit">Book Now</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- Booking Start -->
