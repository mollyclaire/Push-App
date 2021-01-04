console.log('Service worker loaded');

self.addEventListener('push', event => {
  // the data variable is created in order to get the payload we created
  const data = event.data.json();
  console.log('Push received')
  console.log(data.body)
    self.registration.showNotification(data.title, {
      body: data.body,
      requireInteraction: true,
    });
});

// self.addEventListener('notificationclick', function (event) {
//   clients.openWindow("/monday");
// });

self.addEventListener('notificationclick', function(event) {  
  console.log('On notification click: ', event.notification.tag);  
  // Android doesn't close the notification when you click on it  
  // See: http://crbug.com/463146  
  event.notification.close();
  const bodyText = event.notification.body
  const firstArray = bodyText.split(':')
  const text = firstArray[0].split(' ')

  // This looks to see if the current is already open and  
  // focuses if it is  
  event.waitUntil(
    clients.matchAll({  
      type: "window"  
    })
    .then(function(clientList) {  
      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i];  
        if (client.url == '/' && 'focus' in client)  
          return client.focus();  
      }  
      if (clients.openWindow) {
        return clients.openWindow(`https://www.esv.org/${text[0]}+${text[1]}/`);  
      }
    })
  );
});






