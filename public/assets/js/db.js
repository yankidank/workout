let db;
const request = indexedDB.open("workout", 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore("id", { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["id"], "readwrite");
  const store = transaction.objectStore("id");
  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["id"], "readwrite");
  const store = transaction.objectStore("id");
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/workout", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
        .then(() => {
          // delete records if successful
          const transaction = db.transaction(["id"], "readwrite");
          const store = transaction.objectStore("id");
          store.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);
