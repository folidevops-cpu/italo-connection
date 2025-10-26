<template>
  <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="border-b border-gray-200 pb-5 mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Create New Listing</h1>
      <p class="mt-2 text-gray-600">
        Post an item for sale or advertise a room for rent.
      </p>
    </div>

    <!-- Verification Check -->
    <div
      v-if="!canCreateListings"
      class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">
            Email Verification Required
          </h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>You need to verify your email before you can create listings.</p>
            <div class="mt-3">
              <button
                v-if="!isEmailVerified"
                @click="sendVerificationEmail"
                class="font-medium underline"
                :disabled="isSending"
              >
                {{ isSending ? "Sending..." : "Send Verification Email" }}
              </button>
              <span v-if="emailSent" class="ml-2 text-green-600"
                >Verification email sent! Please check your inbox.</span
              >
              <span v-if="emailSendError" class="block mt-1 text-red-600">{{
                emailSendError
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Listing Form -->
    <div v-else class="bg-white shadow rounded-lg p-6">
      <form @submit.prevent="createListing" class="space-y-6">
        <!-- Listing Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            What are you listing?
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="option in listingTypes"
              :key="option.value"
              @click="form.type = option.value"
              class="relative cursor-pointer"
            >
              <input
                :id="option.value"
                v-model="form.type"
                :value="option.value"
                type="radio"
                name="listing-type"
                class="sr-only"
              />
              <div
                class="border-2 rounded-lg p-4 text-center transition-colors"
                :class="
                  form.type === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                <div class="text-2xl mb-2">{{ option.icon }}</div>
                <div class="font-medium text-gray-900">{{ option.label }}</div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ option.description }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputsTextField
              v-model="form.title"
              label="Title"
              type="text"
              placeholder="Enter a descriptive title"
              required
            />
          </div>

          <div>
            <InputsTextField
              v-model="form.price"
              label="Price (€)"
              type="number"
              :placeholder="
                form.type?.includes('room') ? 'Monthly rent' : 'Sale price'
              "
              required
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <InputsTextAreaField
            v-model="form.description"
            label="Description"
            :rows="6"
            :maxlength="500"
            hint="Maximum 500 characters"
            required
            placeholder="Enter description..."
          />
        </div>

        <!-- Location -->
        <div>
          <InputsTextField
            v-model="form.location"
            label="Location"
            type="text"
            placeholder="City, Country"
            required
          />
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Images (Maximum 4) *
          </label>
          <p class="text-sm text-gray-500 mb-3">
            Upload up to 4 photos. First image will be the cover photo.
          </p>

          <!-- Upload Button -->
          <div class="flex items-center gap-4 mb-4">
            <label
              for="image-upload"
              class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :class="{
                'opacity-50 cursor-not-allowed':
                  uploadedImages.length >= 4 || uploading,
              }"
            >
              <svg
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {{ uploading ? "Uploading..." : "Add Photos" }}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              :disabled="uploadedImages.length >= 4 || uploading"
              @change="handleImageSelect"
              class="hidden"
            />
            <span class="text-sm text-gray-500">
              {{ uploadedImages.length }} / 4 images
            </span>
          </div>

          <!-- Upload Error -->
          <div v-if="uploadError" class="mb-4 text-sm text-red-600">
            {{ uploadError }}
          </div>

          <!-- Image Previews -->
          <div
            v-if="uploadedImages.length > 0"
            class="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div
              v-for="(image, index) in uploadedImages"
              :key="image.publicUrl"
              class="relative group"
            >
              <div
                class="aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
              >
                <img
                  :src="image.publicUrl"
                  :alt="`Image ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Cover Badge -->
              <div
                v-if="index === 0"
                class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded"
              >
                Cover
              </div>

              <!-- Remove Button -->
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <!-- Order Badge -->
              <div
                class="absolute bottom-2 left-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded"
              >
                {{ index + 1 }}
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          >
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500">No images uploaded yet</p>
          </div>
        </div>

        <!-- Room-specific fields -->
        <div v-if="form.type?.includes('room')" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="availableFrom"
                class="block text-sm font-medium text-gray-700"
              >
                Available From
              </label>
              <input
                id="availableFrom"
                v-model="form.availableFrom"
                type="date"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div v-if="form.type === 'room_shared'">
              <label
                for="capacity"
                class="block text-sm font-medium text-gray-700"
              >
                Total Capacity
              </label>
              <input
                id="capacity"
                v-model="form.capacity"
                type="number"
                min="1"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Total number of people"
              />
            </div>
          </div>

          <div v-if="form.type === 'room_shared'">
            <label
              for="sharedSlots"
              class="block text-sm font-medium text-gray-700"
            >
              Available Slots
            </label>
            <input
              id="sharedSlots"
              v-model="form.sharedSlots"
              type="number"
              min="1"
              :max="form.capacity"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Number of available slots"
            />
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3 pt-6">
          <NuxtLink
            to="/listings"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting || !isFormValid"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ submitting ? "Creating..." : "Create Listing" }}
          </button>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="submitError" class="text-sm text-red-600">
          {{ submitError }}
        </div>

        <div v-if="submitSuccess" class="text-sm text-green-600">
          Listing created successfully! Redirecting...
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// ✅ Always use definePageMeta for page configuration
definePageMeta({
  middleware: "auth",
});

// Set page meta
useSeoMeta({
  title: "Create Listing - ItaloConnection",
  description: "Create a new listing on ItaloConnection marketplace",
});

// Use the global auth state composable
const { user, refreshUser, isEmailVerified, canCreateListings } =
  useAuthState();

// Email verification state
const isSending = ref(false);
const emailSent = ref(false);
const emailSendError = ref("");

// Refresh session on mount to get latest verification status
onMounted(async () => {
  console.log("Listings create page mounted, refreshing session...");
  await refreshUser();
});

// Handle verification email send
const sendVerificationEmail = async () => {
  isSending.value = true;
  emailSendError.value = "";

  try {
    await $fetch("/api/verify/send", { method: "POST" });
    emailSent.value = true;
    setTimeout(() => {
      emailSent.value = false;
    }, 5000); // Hide message after 5 seconds
  } catch (error: any) {
    console.error("Failed to send verification email:", error);
    emailSendError.value =
      error.data?.message ||
      "Failed to send verification email. Please try again.";

    // Hide error after 5 seconds
    setTimeout(() => {
      emailSendError.value = "";
    }, 5000);
  } finally {
    isSending.value = false;
  }
};

// Listing types
const listingTypes = [
  {
    value: "item",
    icon: "📦",
    label: "Item for Sale",
    description: "Sell products, electronics, furniture, etc.",
  },
  {
    value: "room_single",
    icon: "🛏️",
    label: "Single Room",
    description: "Rent out a private room",
  },
  {
    value: "room_shared",
    icon: "🏠",
    label: "Shared Room",
    description: "Rent multiple beds in shared space",
  },
];

// Form state
const form = ref({
  type: "",
  title: "",
  description: "",
  price: "",
  location: "",
  availableFrom: "",
  capacity: "",
  sharedSlots: "",
});

// Image upload state
const uploadedImages = ref<Array<{ publicUrl: string; key: string }>>([]);
const uploading = ref(false);
const uploadError = ref("");

// Handle image file selection
const handleImageSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) return;

  // Check if adding these files would exceed the limit
  const remainingSlots = 4 - uploadedImages.value.length;
  if (files.length > remainingSlots) {
    uploadError.value = `You can only upload ${remainingSlots} more image${
      remainingSlots !== 1 ? "s" : ""
    }`;
    setTimeout(() => (uploadError.value = ""), 5000);
    return;
  }

  // Validate file types and sizes
  const validFiles: File[] = [];
  for (const file of Array.from(files)) {
    // Check file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      uploadError.value = `${file.name} is not a valid image type. Only JPEG, PNG, and WebP are allowed.`;
      setTimeout(() => (uploadError.value = ""), 5000);
      continue;
    }

    // Check file size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      uploadError.value = `${file.name} is too large. Maximum size is 3MB.`;
      setTimeout(() => (uploadError.value = ""), 5000);
      continue;
    }

    validFiles.push(file);
  }

  if (validFiles.length === 0) return;

  uploading.value = true;
  uploadError.value = "";

  try {
    // Check if listing type is selected
    if (!form.value.type) {
      throw new Error("Please select a listing type first");
    }

    // Upload each file to the server (which uploads to S3)
    for (const file of validFiles) {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("listingType", form.value.type);

      // Upload to our server endpoint
      const { publicUrl, key } = await $fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      // Add to uploaded images
      uploadedImages.value.push({ publicUrl, key });
    }
  } catch (error: any) {
    console.error("Image upload failed:", error);
    uploadError.value =
      error.message || "Failed to upload images. Please try again.";
  } finally {
    uploading.value = false;
    // Reset input
    target.value = "";
  }
};

// Remove an image
const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1);
};

// Form validation
const isFormValid = computed(() => {
  return (
    form.value.type &&
    form.value.title &&
    form.value.description &&
    form.value.price &&
    parseFloat(form.value.price) > 0 &&
    uploadedImages.value.length > 0
  ); // Require at least 1 image
});

// Submission state
const submitting = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

// ✅ Use $fetch for form submission
const createListing = async () => {
  if (!isFormValid.value) {
    submitError.value =
      "Please fill in all required fields and upload at least one image";
    return;
  }

  submitting.value = true;
  submitError.value = "";
  submitSuccess.value = false;

  try {
    const listingData = {
      type: form.value.type,
      title: form.value.title,
      description: form.value.description,
      price: parseFloat(form.value.price),
      location: form.value.location || null,
      availableFrom: form.value.availableFrom || null,
      capacity: form.value.capacity ? parseInt(form.value.capacity) : null,
      sharedSlots: form.value.sharedSlots
        ? parseInt(form.value.sharedSlots)
        : null,
      // Add images data
      images: uploadedImages.value.map((img, index) => ({
        url: img.publicUrl,
        key: img.key,
        type: "image",
        order: index,
      })),
    };

    await $fetch("/api/listings", {
      method: "POST",
      body: listingData,
    });

    submitSuccess.value = true;

    // Redirect to listings page after success
    setTimeout(() => {
      navigateTo("/listings");
    }, 1500);
  } catch (error: any) {
    submitError.value = error.data?.message || "Failed to create listing";
  } finally {
    submitting.value = false;
  }
};
</script>
