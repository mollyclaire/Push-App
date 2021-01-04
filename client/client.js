
const publicVapidKey = "BFRS-nY2Szr5q3CoT5fQjU1jpPhsG-m8-Z9kQqAtvJTdRzZTPy3fik8jKb6j15-b6QjlP8t2s_lKauICAHkh-as";

// Check for service worker (will the browser allow it?)
// navigator is the API for the browser itself
if ('serviceWorker' in navigator) {
  send().catch(error => console.error(error));
  
}

// Register the service worker, register our push, send the push
async function send() {
  console.log('Registering service worker...')
  const register = await navigator.serviceWorker.register('/serviceWorker.js', {
    // this worker is applied to the home page/index
    scope: '/'
  })
  console.log('Service worker registered')

  console.log('Registering push...')
  // register is the variable when we registered the service worker (all of this code can be found on the web-push Github page)
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log('Push registered')

  console.log('Sending push notification...')
  // Send the subscription obejct to our backend (see index.js)
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('Push sent')
}

// Converting URL safe base64 string to a Unit8Array to pass into the subscribe call
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}