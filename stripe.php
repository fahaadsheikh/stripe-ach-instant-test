<?php
require 'vendor/autoload.php'; // Include the Stripe PHP library

// Set your secret API key
\Stripe\Stripe::setApiKey('sk_test_51M2ZgGHR0KP5on30QvDfnQVr8lrxEM2TbyEetimLKTFE38liH1sLkOHaY4Xjpd1EusU5eKNGYdHObyVQjpMq94sx00SkUemSwO');

// Retrieve the data sent via POST request
$data = json_decode(file_get_contents("php://input"), true);

// Check if data is received
if ($data) {
    $amount = 1000; // Amount in cents, change this as needed
    $currency = 'usd';
    $description = 'For Stripe Testing Purposes'; // Change this as needed
    $metadata = array(
        'email' => $data['email'],
    );

    try {
        // Create a payment method
        $stripe = new \Stripe\StripeClient('sk_test_51M2ZgGHR0KP5on30QvDfnQVr8lrxEM2TbyEetimLKTFE38liH1sLkOHaY4Xjpd1EusU5eKNGYdHObyVQjpMq94sx00SkUemSwO');

        // Create a Payment Intent
        $intent = \Stripe\PaymentIntent::create([
            'amount' => $amount,
            'currency' => $currency,
            'description' => $description,
            'metadata' => $metadata,
            'payment_method_types' => ['us_bank_account'],
            'setup_future_usage' => 'on_session',
            'payment_method_options' => [
                'us_bank_account' => [
                    'verification_method' => 'instant',
                    'financial_connections' => ['permissions' => ['payment_method', 'balances']],
                ]
            ]
        ]);

        // Payment Intent created successfully
        $response = array(
            'status' => 'success',
            'message' => 'Payment Intent created successfully',
            'client_secret' => $intent->client_secret // Client secret to be used on the client-side to confirm the payment
        );
    } catch (\Stripe\Exception\ApiErrorException $e) {
        // Error occurred while creating Payment Intent
        $response = array(
            'status' => 'error',
            'message' => $e->getMessage()
        );
    }

    // Send the response back to the client as JSON
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    // No data received
    $response = array(
        'status' => 'error',
        'message' => 'No data received'
    );

    // Send the response back to the client as JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
