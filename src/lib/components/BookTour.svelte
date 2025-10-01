<script>
	export let packageName;
</script>

<h1 class="text-white mb-4">Book A Tour</h1>
<form action="https://formspree.io/f/mzzadyjj" method="POST">
	<div class="row g-3 text-white">
		<div class="col-12">
			<div class="form-floating">
				<input
					type="text"
					class="form-control bg-transparent"
					id="name"
					name="name"
					placeholder="Your Name"
					required
				/>
				<label for="name">Your Name</label>
			</div>
		</div>

		<div class="col-6">
			<div class="form-floating">
				<input
					type="email"
					class="form-control bg-transparent"
					id="email"
					name="email"
					placeholder="Your Email"
					required
				/>
				<label for="email">Your Email</label>
			</div>
		</div>

		<div class="col-6">
			<div class="form-floating">
				<input
					type="phone"
					class="form-control bg-transparent"
					id="phone"
					name="phone"
					placeholder="Your Phone Number"
					required
				/>
				<label for="phone">Your Phone</label>
			</div>
		</div>

		<div class="col-6">
			<div class="form-floating">
				<input type="date" class="form-control bg-transparent" id="date" name="date" required />
				<label for="date">Date</label>
			</div>
		</div>

		<div class="col-6">
			<div class="form-floating">
				<input type="time" class="form-control bg-transparent" id="time" name="time" required />
				<label for="time">Time</label>
			</div>
		</div>

		<div class="col-12">
			<div class="form-floating">
				<input
					type="text"
					class="form-control bg-transparent"
					id="destination"
					name="destination"
					value={packageName}
					required
				/>
				<label for="destination">Destination</label>
			</div>
		</div>

		<div class="col-12">
			<div class="form-floating">
				<select class="form-select bg-transparent" id="language" name="language" required>
					<option value="">Select Language</option>
					<option value="English">English</option>
					<option value="French">French</option>
					<option value="German">German</option>
					<option value="Spanish">Spanish</option>
					<option value="Italian">Italian</option>
					<option value="Swahili">Swahili</option>
					<option value="Arabic">Arabic</option>
				</select>
				<label for="language">Languages</label>
			</div>
		</div>

		<div class="col-12">
			<div class="form-floating">
				<input
					type="text"
					class="form-control bg-transparent"
					id="meetingPoint"
					name="meetingPoint"
					placeholder="Meeting Point"
					required
				/>
				<label for="meetingPoint">Meeting Point</label>
			</div>
		</div>

		<div class="col-12">
			<div class="form-floating">
				<textarea
					class="form-control bg-transparent"
					placeholder="Special Request"
					id="message"
					name="message"
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
