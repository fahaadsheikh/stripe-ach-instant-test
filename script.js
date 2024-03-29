document.addEventListener('DOMContentLoaded', function () {
	var stripe = Stripe('pk_test_51M2ZgGHR0KP5on30b9bnc4iaj4Ndu5GEhA0caCBpKKZHEWUwQUUF4X0iOtT4dfJHu8o0Lh4KPwa7EwqxWUleTkru00IG6FWyWg');

	var form = document.getElementById('payment-form');
	form.addEventListener('submit', function (event) {
		event.preventDefault();

		var name = document.getElementById('name').value;
		var email = document.getElementById('email').value;
		var bankRoutingNumber = document.getElementById('bank-routing-number').value;
		var bankAccountNumber = document.getElementById('bank-account-number').value;
		var accountType = document.getElementById('account-type').value;
		console.log('submitted');

		// Create a new XMLHttpRequest object
		var xhr = new XMLHttpRequest();

		// Define the PHP file URL and method (POST)
		var url = 'stripe.php';
		var method = 'POST';

		// Set up the request
		xhr.open(method, url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		// Define the data to be sent to the PHP file
		var data = JSON.stringify({
			name: name,
			email: email,
			bankRoutingNumber: bankRoutingNumber,
			bankAccountNumber: bankAccountNumber,
			accountType: accountType,
		});

		// Define what to do when the request is complete
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				// Response from the PHP function
				var response = JSON.parse(xhr.responseText);
				console.log(response);
				// Handle the response here

				stripe
					.confirmUsBankAccountPayment(response.client_secret, {
						payment_method: {
							us_bank_account: {
								routing_number: bankRoutingNumber,
								account_number: bankAccountNumber,
								account_holder_type: accountType,
							},
							billing_details: {
								name: name,
								email: email,
							},
						},
					})
					.then(function (result) {
						if (result.error) {
							// Inform the customer that there was an error.
							console.log(result.error.message);
						} else {
							// Handle next step based on PaymentIntent's status.
							console.log('PaymentIntent ID: ' + result.paymentIntent.id);
							console.log('PaymentIntent status: ' + result.paymentIntent.status);
						}
					});
			}
		};

		// Send the request with the data
		xhr.send(data);
	});
});
