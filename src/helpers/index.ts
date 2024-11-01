export const fetcher = async <T=any>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
};

export async function cacheImage(url: string): Promise<string> {
  const cache = await caches.open('image-cache');
  const cachedResponse = await cache.match(url);

  if (cachedResponse) {
    return URL.createObjectURL(await cachedResponse.blob());
  }

  const response = await fetch(url);
  await cache.put(url, response.clone());
  return URL.createObjectURL(await response.blob());
}

type SnackbarType = "default" | "success" | "error";

export function showSnackbar(message: string, type: SnackbarType = "default"): void {
  const snackbar = document.getElementById("snackbar") as HTMLDivElement | null;
  const snackbarMessage = document.getElementById("snackbar-message") as HTMLParagraphElement | null;

  if (!snackbar || !snackbarMessage) {
    console.warn("Snackbar elements not found in the DOM.");
    return;
  }

  // Set the message text
  snackbarMessage.textContent = message;

  // Remove any existing color classes
  snackbar.classList.remove("bg-gray-800", "bg-green-500", "bg-red-500");

  // Add color class based on the type
  switch (type) {
    case "success":
      snackbar.classList.add("bg-green-500");
      break;
    case "error":
      snackbar.classList.add("bg-red-500");
      break;
    default:
      snackbar.classList.add("bg-gray-800");
  }

  // Show the snackbar
  snackbar.classList.remove("opacity-0");
  snackbar.classList.add("opacity-100");

  // Hide the snackbar after 3 seconds
  setTimeout(() => {
    snackbar.classList.remove("opacity-100");
    snackbar.classList.add("opacity-0");
  }, 3000);
}

