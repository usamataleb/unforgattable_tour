<script>
	export let packageName;
</script>

<h1 class="text-white mb-4">Book A Tour</h1>
<form action="https://formspree.io/f/mzzadyjj" method="POST">
	<div class="row g-3 text-white">
		<div class="col-12">
			<div class="form-floating">
				<input type="text" class="form-control bg-transparent" id="name" placeholder="Your Name" required />
				<label for="name">Your Name</label>
			</div>
		</div>
		<div class="col-6">
			<div class="form-floating">
				<input
					type="email"
					class="form-control bg-transparent"
					id="email"
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
					placeholder="Your Pone Number"
                    required
				/>
				<label for="email">Your Phone</label>
			</div>
		</div>
		<div class="col-6">
			<div class="form-floating date" id="date3" data-target-input="nearest">
				<input
					type="date"
					class="form-control bg-transparent datetimepicker-input"
					id="datetime"
					placeholder="Date & Time"
					data-target="#date3"
					data-toggle="datetimepicker"
                    required
				/>
				<label for="datetime">Date </label>
			</div>
		</div>

        		<div class="col-6">
			<div class="form-floating date" id="date3" data-target-input="nearest">
				<input
					type="time"
					class="form-control bg-transparent datetimepicker-input"
					id="datetime"
					placeholder="Date & Time"
					data-target="#date3"
					data-toggle="datetimepicker"
                    required
				/>
				<label for="datetime">Time</label>
			</div>
		</div>
		<div class="col-12">
			<div class="form-floating">
				<input
					type="text"
					class="form-control bg-transparent"
					id="name"
					placeholder="Destination"
					value={packageName}
                    required
				/>

				<label for="select1">Destination</label>
			</div>
		</div>

		<div class="col-12">
			<div class="form-floating">
				<select class="form-select bg-transparent" id="select1" required >
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

		<div class="col-12">
			<div class="form-floating">
				<input
					type="text"
					class="form-control bg-transparent"
					id="name"
					placeholder="Destination"
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
