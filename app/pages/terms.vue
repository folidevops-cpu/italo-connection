<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
      <p class="text-lg text-gray-600">
        Last updated: {{ new Date().toLocaleDateString() }}
      </p>
    </div>

    <div class="prose prose-lg max-w-none">
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
        <p class="text-gray-700 mb-4">
          By accessing and using ItaloConnection ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
        <p class="text-gray-700 mb-4">
          ItaloConnection is a marketplace platform that connects users for buying, selling items, and finding accommodation. We provide the platform but do not directly participate in transactions between users.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. User Registration and Verification</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Account Requirements</h3>
            <ul class="list-disc pl-6 text-gray-700 space-y-1">
              <li>You must be at least 18 years old to use our service</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must verify your email address and phone number to create listings</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. Listing Guidelines</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Acceptable Content</h3>
            <ul class="list-disc pl-6 text-gray-700 space-y-1">
              <li>Listings must be accurate and truthful</li>
              <li>Only list items you own or have authority to sell/rent</li>
              <li>Images must accurately represent the item or property</li>
              <li>Pricing must be clear and honest</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Prohibited Content</h3>
            <ul class="list-disc pl-6 text-gray-700 space-y-1">
              <li>Illegal items or services</li>
              <li>Fraudulent or misleading listings</li>
              <li>Discriminatory content or practices</li>
              <li>Adult content or services</li>
              <li>Weapons, drugs, or other dangerous items</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. User Responsibilities</h2>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>Comply with all applicable laws and regulations</li>
          <li>Respect other users and maintain professional conduct</li>
          <li>Protect your account credentials and personal information</li>
          <li>Report suspicious or fraudulent activity</li>
          <li>Honor agreements made with other users</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Platform Policies</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Content Moderation</h3>
            <p class="text-gray-700 mb-2">
              We reserve the right to review, modify, or remove any content that violates our terms or community guidelines.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Account Suspension</h3>
            <p class="text-gray-700 mb-2">
              We may suspend or terminate accounts that violate our terms, engage in fraudulent activity, or harm other users.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
        <p class="text-gray-700 mb-4">
          ItaloConnection serves as a platform connecting users. We are not responsible for the quality, safety, or legality of items listed, the truth or accuracy of listings, or the ability of users to complete transactions.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibent text-gray-900 mb-4">8. Privacy Policy</h2>
        <p class="text-gray-700 mb-4">
          Your privacy is important to us. Please review our 
          <NuxtLink to="/privacy" class="text-blue-600 hover:text-blue-700 underline">Privacy Policy</NuxtLink> 
          to understand how we collect, use, and protect your information.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
        <p class="text-gray-700 mb-4">
          We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of modified terms.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
        <p class="text-gray-700 mb-4">
          If you have any questions about these Terms of Service, please contact us:
        </p>
        <div class="bg-gray-50 p-4 rounded-md">
          <p class="text-gray-700">
            <strong>Email:</strong> legal@italoconnection.com<br>
            <strong>Address:</strong> ItaloConnection, Via Roma 123, 00100 Rome, Italy
          </p>
        </div>
      </section>
    </div>

    <div class="mt-12 text-center">
      <NuxtLink
        to="/"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
useSeoMeta({
  title: 'Terms of Service - ItaloConnection',
  description: 'Terms of service and user agreement for ItaloConnection marketplace platform'
})
</script>