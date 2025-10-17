<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
      <p class="text-lg text-gray-600">
        Last updated: {{ new Date().toLocaleDateString() }}
      </p>
    </div>

    <div class="prose prose-lg max-w-none">
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
        <p class="text-gray-700 mb-4">
          Welcome to ItaloConnection ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our marketplace platform.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
            <ul class="list-disc pl-6 text-gray-700 space-y-1">
              <li>Name and contact information (email address, phone number)</li>
              <li>Profile information and bio</li>
              <li>Location data</li>
              <li>Payment and billing information</li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Listing Information</h3>
            <ul class="list-disc pl-6 text-gray-700 space-y-1">
              <li>Listing details (title, description, price, images)</li>
              <li>Property or item information</li>
              <li>Availability and booking data</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Technical Information</h3>
            <ul class="list-disc pl-6 text-gray-700 space-y-1">
              <li>IP address and browser information</li>
              <li>Device and usage data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>To provide and maintain our platform services</li>
          <li>To process transactions and manage listings</li>
          <li>To communicate with you about your account and our services</li>
          <li>To verify your identity and prevent fraud</li>
          <li>To improve our platform and develop new features</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
        <p class="text-gray-700 mb-4">
          We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
        </p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>With other users as necessary to facilitate transactions</li>
          <li>With service providers who assist in our operations</li>
          <li>When required by law or to protect our rights</li>
          <li>In connection with a business transfer or merger</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
        <p class="text-gray-700 mb-4">
          We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
        <p class="text-gray-700 mb-4">You have the right to:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>Access and update your personal information</li>
          <li>Request deletion of your account and data</li>
          <li>Opt out of certain communications</li>
          <li>Request a copy of your data</li>
          <li>Object to certain uses of your information</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
        <p class="text-gray-700 mb-4">
          If you have any questions about this Privacy Policy or our data practices, please contact us:
        </p>
        <div class="bg-gray-50 p-4 rounded-md">
          <p class="text-gray-700">
            <strong>Email:</strong> privacy@italoconnection.com<br>
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
  title: 'Privacy Policy - ItaloConnection',
  description: 'Privacy policy and data protection information for ItaloConnection marketplace platform'
})
</script>