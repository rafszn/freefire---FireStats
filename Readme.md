Free Fire Application Setup Locally

Prerequisites
- Node.js installed on your system
- VS Code installed
- Internet connection for dependency installation

Folder Structure
FreeFire
│
├── server/   Back-end (Node.js + Express)
└── ui/       Front-end (React)

Steps to Run the Application

1. Open the Project in VS Code
   - Launch VS Code and open the FreeFire.app folder.

2. Run the Back End
   - Open a terminal in VS Code.  
   - Navigate to the server folder:  
   
     run: cd server
    
   - Install dependencies:
    run: npm install

   - Start the server:
     run: npm start

3. Run the Front End  
   - Open a new terminal in VS Code. 
 
   - Navigate to the ui folder:  
     run: cd ui
    
   - Install dependencies:  
     run: npm install
    
   - Start the React app:  
     run: npm run dev

4. Access the Application
   - Open a browser and visit:  http://localhost:5173 (default React port)