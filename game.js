// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZPdAtqmvGSc0-CSr5CYH5cQcV7ez3qgg",
  authDomain: "summit-7-zork.firebaseapp.com",
  databaseURL: "https://summit-7-zork-default-rtdb.firebaseio.com",
  projectId: "summit-7-zork",
  storageBucket: "summit-7-zork.firebasestorage.app",
  messagingSenderId: "631600869041",
  appId: "1:631600869041:web:695fda880031d0a5c87c90",
  measurementId: "G-VLDLBLWK1P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Game world definition
const rooms = {
  serviceDesk: {
    description: "You are at the Service Desk of Summit 7. A computer hums, and a note lies on the desk. An incident report is pinned to a board. Exits: north to Engineering Lab, east to Client Network, west to Training Room, south to Security Vault.",
    exits: { north: "engineeringLab", east: "clientNetwork", west: "trainingRoom", south: "securityVault" },
    items: ["note", "incident report"],
    state: {}
  },
  engineeringLab: {
    description: "You are in the Engineering Lab. A computer with antivirus software is locked with a password prompt. A firewall config sits on a shelf. Exits: south to Service Desk, east to Incident Response Room, north to NOC.",
    exits: { south: "serviceDesk", east: "incidentResponse", north: "noc" },
    items: ["firewall config"],
    state: { computer: 'locked' }
  },
  trainingRoom: {
    description: "You are in the Training Room. A training manual rests on a table, offering cybersecurity basics. Exit: east to Service Desk.",
    exits: { east: "serviceDesk" },
    items: ["training manual"],
    state: {}
  },
  securityVault: {
    description: "You are in the Security Vault. A locked safe contains an encryption key. Exit: north to Service Desk.",
    exits: { north: "serviceDesk" },
    items: ["encryption key"],
    state: {}
  },
  incidentResponse: {
    description: "You are in the Incident Response Room. A whiteboard lists protocols, and a malware sample is in a secure container. An analyzer hums nearby. Exit: west to Engineering Lab.",
    exits: { west: "engineeringLab" },
    items: ["malware sample"],
    state: {}
  },
  clientNetwork: {
    description: "You are in the Client Network.\n" +
                 "    ____\n" +
                 "   /    \\\n" +
                 "  /______\\\n" +
                 "  | INF  | An infected server blinks red.\n" +
                 "  |______|\n" +
                 "A vulnerable gateway needs securing. Exit: west to Service Desk.",
    exits: { west: "serviceDesk" },
    items: [],
    state: { server: 'infected' }
  },
  noc: {
    description: "You are in the Network Operations Center (NOC). A console awaits final configurations to secure the network. Exit: south to Engineering Lab.",
    exits: { south: "engineeringLab" },
    items: [],
    state: {}
  }
};

// Initial game state
const initialGameState = {
  antivirusUnlocked: false,
  malwareAnalyzed: false,
  patchApplied: false,
  firewallDeployed: false,
  trained: false
};

// Game state variables
let currentRoom = "serviceDesk";
let inventory = [];
let gameState = { ...initialGameState };

// Output text to the screen
function output(text) {
  const outputDiv = document.getElementById("output");
  const p = document.createElement("p");
  p.textContent = text;
  outputDiv.appendChild(p);
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

// Reset game to initial state
function resetGame() {
  currentRoom = "serviceDesk";
  inventory = [];
  gameState = { ...initialGameState };
  rooms.engineeringLab.state = { computer: 'locked' };
  rooms.clientNetwork.state = { server: 'infected' };
  rooms.incidentResponse.state = {};
  rooms.noc.state = {};
  output("Game reset. Starting over.");
  look();
}

// Look around the current room
function look() {
  const room = rooms[currentRoom];
  let description = room.description;

  if (currentRoom === "engineeringLab") {
    description = room.state.computer === 'locked'
      ? "You are in the Engineering Lab. A computer with antivirus software is locked with a password prompt. A firewall config sits on a shelf."
      : "You are in the Engineering Lab. The computer is unlocked, antivirus ready. A firewall config sits on a shelf.";
  } else if (currentRoom === "clientNetwork") {
    description = room.state.server === 'infected'
      ? "You are in the Client Network.\n" +
        "    ____\n" +
        "   /    \\\n" +
        "  /______\\\n" +
        "  | INF  | An infected server blinks red.\n" +
        "  |______|\n" +
        "A vulnerable gateway needs securing. Exit: west to Service Desk."
      : "You are in the Client Network. The server is clean and secure. A vulnerable gateway needs securing. Exit: west to Service Desk.";
  }

  if (room.items.length > 0) {
    description += " You see: " + room.items.join(", ") + ".";
  }
  output(description);
}

// Move to another room
function go(direction) {
  const room = rooms[currentRoom];
  if (room.exits[direction]) {
    currentRoom = room.exits[direction];
    look();
  } else {
    output("You can't go that way.");
  }
}

// Take an item
function take(item) {
  const room = rooms[currentRoom];
  const index = room.items.indexOf(item);
  if (index !== -1) {
    inventory.push(item);
    room.items.splice(index, 1);
    output("You take the " + item + ".");
  } else {
    output("There is no " + item + " here.");
  }
}

// Use an item on a target
function use(item, target) {
  if (currentRoom === "engineeringLab" && item === "note" && target === "computer" && inventory.includes("note")) {
    if (rooms.engineeringLab.state.computer === 'locked') {
      output("You enter the password from the note. The computer unlocks, and you copy the antivirus software to a USB drive.");
      inventory.push("antivirus");
      gameState.antivirusUnlocked = true;
      rooms.engineeringLab.state.computer = 'unlocked';
    } else {
      output("The computer is already unlocked.");
    }
  } else if (currentRoom === "incidentResponse" && item === "malware sample" && target === "analyzer" && inventory.includes("malware sample")) {
    output("You analyze the malware sample. It reveals a vulnerability needing a patch.");
    inventory.push("security patch");
    gameState.malwareAnalyzed = true;
  } else if (currentRoom === "clientNetwork" && item === "antivirus" && target === "server" && inventory.includes("antivirus")) {
    if (rooms.clientNetwork.state.server === 'infected') {
      output("You run the antivirus on the infected server. The malware is eradicated.");
      rooms.clientNetwork.state.server = 'clean';
      checkVictory();
    } else {
      output("The server is already clean.");
    }
  } else if (currentRoom === "clientNetwork" && item === "security patch" && target === "gateway" && inventory.includes("security patch") && gameState.malwareAnalyzed) {
    output("You apply the security patch to the vulnerable gateway.");
    gameState.patchApplied = true;
    checkVictory();
  } else if (currentRoom === "noc" && item === "firewall config" && target === "console" && inventory.includes("firewall config") && gameState.trained) {
    output("You configure the firewall on the NOC console, blocking further intrusions.");
    gameState.firewallDeployed = true;
    checkVictory();
  } else {
    output("You can't use " + item + " on " + target + " here.");
  }
}

// Check for victory condition
function checkVictory() {
  if (gameState.antivirusUnlocked && gameState.patchApplied && gameState.firewallDeployed) {
    output("The network is fully secure. Victory!");
  } else {
    output("Progress made, but the network isn't fully secure yet.");
  }
}

// Read an item
function read(item) {
  if (inventory.includes(item)) {
    if (item === "note") {
      output("The note reads: 'Password: Summit7Cyber'.");
    } else if (item === "training manual") {
      output("The manual teaches you to analyze logs and configure firewalls. You feel prepared.");
      gameState.trained = true;
    } else if (item === "incident report") {
      output("The report states: 'Client network compromised. Malware detected. Secure servers and gateway.'");
    } else {
      output("There's nothing to read on the " + item + ".");
    }
  } else {
    output("You don't have a " + item + " to read.");
  }
}

// Show inventory
function inventoryCommand() {
  if (inventory.length === 0) {
    output("Your inventory is empty.");
  } else {
    output("You are carrying: " + inventory.join(", "));
  }
}

// Show help
function help() {
  output("Commands:\n" +
         "- go [direction]: Move (e.g., 'go north')\n" +
         "- take [item]: Pick up an item (e.g., 'take note')\n" +
         "- use [item] on [target]: Use an item (e.g., 'use note on computer')\n" +
         "- read [item]: Examine an item (e.g., 'read manual')\n" +
         "- look: View the room\n" +
         "- inventory: Check your items\n" +
         "- save: Save your game\n" +
         "- load: Load your game\n" +
         "- new: Start a new game\n" +
         "- help: Show this message\n" +
         "Hint: Explore rooms and read items for clues!");
}

// **Firebase Authentication Functions**
function signUp(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      output("Account created successfully!");
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("gameScreen").style.display = "block";
      loadGame(userCredential.user.uid);
    })
    .catch((error) => {
      output("Error: " + error.message);
    });
}

function logIn(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      output("Logged in successfully!");
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("gameScreen").style.display = "block";
      loadGame(userCredential.user.uid);
    })
    .catch((error) => {
      output("Error: " + error.message);
    });
}

function logInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      output("Logged in with Google successfully!");
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("gameScreen").style.display = "block";
      loadGame(result.user.uid);
    })
    .catch((error) => {
      output("Error: " + error.message);
    });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    loadGame(user.uid);
  } else {
    document.getElementById("loginScreen").style.display = "block";
    document.getElementById("gameScreen").style.display = "none";
    output("Please log in to continue.");
  }
});

// Cloud Save and Load
function saveGame() {
  const user = auth.currentUser;
  if (user) {
    const saveData = {
      currentRoom: currentRoom,
      inventory: inventory,
      gameState: gameState,
      rooms: Object.fromEntries(
        Object.entries(rooms).map(([key, room]) => [key, { state: room.state }])
      )
    };
    database.ref('users/' + user.uid + '/save').set(saveData)
      .then(() => {
        output("Game saved successfully!");
      })
      .catch((error) => {
        output("Error saving game: " + error.message);
      });
  } else {
    output("You need to be logged in to save the game.");
  }
}

function loadGame(uid) {
  database.ref('users/' + uid + '/save').once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        currentRoom = data.currentRoom;
        inventory = data.inventory;
        gameState = data.gameState;
        Object.keys(rooms).forEach(key => {
          rooms[key].state = data.rooms[key].state;
        });
        output("Game loaded successfully!");
        look();
      } else {
        output("No saved game found. Starting a new game.");
        resetGame();
      }
    })
    .catch((error) => {
      output("Error loading game: " + error.message);
    });
}

// Natural language parser
function parseInput(input) {
  const synonyms = {
    go: ["go", "move", "walk", "head", "proceed"],
    take: ["take", "pick up", "grab", "get", "acquire"],
    use: ["use", "apply", "utilize", "employ"],
    look: ["look", "examine", "inspect", "view"],
    read: ["read", "peruse", "study", "check"],
    inventory: ["inventory", "items", "possessions"],
    help: ["help", "assist", "guide", "instructions"],
    save: ["save", "store"],
    load: ["load", "restore"],
    new: ["new", "start over", "reset"]
  };

  const directions = ["north", "south", "east", "west"];
  const words = input.trim().toLowerCase().split(" ");
  let command = words[0];
  let argument = words.slice(1).join(" ");

  for (const [action, synList] of Object.entries(synonyms)) {
    if (synList.includes(command)) {
      command = action;
      break;
    }
  }

  if (command === "go" && directions.includes(words[1])) {
    return { command: "go", argument: words[1] };
  } else if (command === "take") {
    return { command: "take", argument: argument };
  } else if (command === "use" && argument.includes(" on ")) {
    const parts = argument.split(" on ");
    return { command: "use", argument: { item: parts[0].trim(), target: parts[1].trim() } };
  } else if (command === "read") {
    return { command: "read", argument: argument };
  } else if (["look", "inventory", "help", "save", "load", "new"].includes(command)) {
    return { command, argument: "" };
  } else {
    return { command: "unknown", argument: "" };
  }
}

// Handle commands
function handleCommand(command, argument) {
  if (command === "new") {
    resetGame();
  } else {
    switch (command) {
      case "look":
        look();
        break;
      case "go":
        go(argument);
        break;
      case "take":
        take(argument);
        break;
      case "use":
        use(argument.item, argument.target);
        break;
      case "read":
        read(argument);
        break;
      case "inventory":
        inventoryCommand();
        break;
      case "help":
        help();
        break;
      case "save":
        saveGame();
        break;
      case "load":
        const user = auth.currentUser;
        if (user) loadGame(user.uid);
        else output("Please log in to load your game.");
        break;
      default:
        output("Unknown command. Type 'help' for assistance.");
    }
  }
}

// Initialize game and set up event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Sign Up Button
  document.getElementById('signUpButton').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signUp(email, password);
  });

  // Log In Button
  document.getElementById('logInButton').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    logIn(email, password);
  });

  // Google Log In Button
  document.getElementById('googleLogInButton').addEventListener('click', logInWithGoogle);

  // Existing command input listener
  const input = document.getElementById("commandInput");
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const inputText = input.value;
      input.value = "";
      output("> " + inputText);
      const { command, argument } = parseInput(inputText);
      handleCommand(command, argument);
    }
  });

  output("Welcome to Summit 7: Cybersecurity Crisis. Type 'help' for commands.");
  look();
});