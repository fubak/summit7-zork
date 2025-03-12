# Summit 7 Zork Clone

A text-based adventure game inspired by the classic Zork, set in a cybersecurity context. As a new recruit at Summit 7, an MSP/MSSP, your mission is to secure a client’s network against a cyber breach by completing specific tasks. The game features natural language input, cloud-based save/load functionality, and a clear victory condition.

## Features

- **Natural Language Input**: Use flexible commands like `go north`, `take note`, or `use antivirus on server` to interact with the game world.
- **Cloud Saves**: Save and load your game progress using Firebase Authentication and Realtime Database.
- **Room State Persistence**: Actions like cleaning a server or unlocking a computer persist until the game is reset.
- **New Game Command**: Start over with the `new` command to reset the game to its initial state.
- **Google Login**: Authenticate using Google for a seamless login experience.

## How to Play

1. **Sign Up/Log In**:
   - Before starting, enter an email and password in the provided fields to either sign up for a new account or log in to an existing one.
   - Alternatively, use the "Log In with Google" button for quick access.
   - Authentication is required to save and load your game progress using Firebase cloud storage. Once logged in, the authentication form will disappear, and you can begin playing.

2. **Game Objective**:
   - You are a new recruit at Summit 7, tasked with securing a client’s network against a cybersecurity breach. Your goal is to:
     - Unlock and use antivirus software to clean an infected server.
     - Patch a vulnerable gateway to prevent further exploits.
     - Deploy a firewall configuration to block intrusions.
   - Victory is achieved when all three tasks are completed, securing the client’s network.

3. **Commands**:
   - The game supports natural language inputs with multiple synonyms for flexibility. Enter commands in the text box and press Enter to execute them. Examples include:
     - `go/move/walk/head [direction]`: Move between rooms (e.g., `go north`, `walk east`).
     - `take/pick up/grab/get [item]`: Collect items (e.g., `take note`, `pick up manual`).
     - `use/apply [item] on [target]`: Use an item on a specific target (e.g., `use note on computer`, `apply antivirus on server`).
     - `read [item]`: Examine an item for clues (e.g., `read note`, `study manual`).
     - `look/examine`: View the current room’s description and items.
     - `inventory/items`: Check what you’re carrying.
     - `save/store`: Save your current progress to the cloud (requires login).
     - `load/restore`: Load your saved game from the cloud (requires login).
     - `new`: Start a new game, resetting all progress.
     - `help/guide`: Display this command list and a gameplay hint.

4. **Walkthrough**:
   - **Start**: Begin at the Service Desk. Use `look` to see a note and incident report. Type `take note` and `read note` to reveal the password "Summit7Cyber".
   - **Unlock Antivirus**: Type `go north` to enter the Engineering Lab, then `use note on computer` to unlock and obtain the antivirus software.
   - **Train**: Return with `go south` to the Service Desk, then `go west` to the Training Room. Use `take training manual` and `read manual` to gain skills for firewall configuration.
   - **Analyze Malware**: Go back with `go east` to the Service Desk, then `go north` and `go east` to the Incident Response Room. Type `take malware sample` and `use malware sample on analyzer` to get a security patch.
   - **Secure Client Network**: Return with `go west`, `go south`, and `go east` to the Client Network. Use `use antivirus on server` to remove malware, then `use security patch on gateway` to fix the vulnerability.
   - **Deploy Firewall**: Go back with `go west` to the Service Desk, then `go north` to the Engineering Lab. Type `take firewall config`, then `go north` to the NOC and `use firewall config on console` to block intrusions.
   - **Victory**: Completing all steps (antivirus, patch, firewall) triggers a victory message: "The network is fully secure. Victory!"
   - **Save/Load**: At any point, use `save` to store your progress and `load` to resume, ensuring your game persists across sessions.

5. **Tips**:
   - Explore all rooms for clues and items.
   - Read items like the note and manual for critical information.
   - Use `help` if stuck, and check your `inventory` to track progress.
   - Save frequently to preserve your game state in the cloud.
