# NOTION.IO CLONE
## TECH STACK
---> FRONTEND ---> REACT
---> BACKEND --->  EXPRESS
---> DATABASE ---> FIREBASE
---> AUTHENTICATION --> FIREBASE

## SET UP
GO TO -->/frontend --> npm install --> npm run dev
GO TO -->/frontend/y-webrtc --> npm install --> node ./bin/server.js
GO TO -->/backend --> npm install --> node index.js


## EXECUTION PLAN
<pre>
   1.First I completed the Authentication part of the Application
   2.Written zod for login and register
   3.Next tried to implement the Frontend for those api endpoints
   4.Next started with the main document page,
   5.Started with a approach that there should be many block in one document,
   6.Successfully implemented the CRUD operations for that, Then started The frontend,
   7.Where I got struct at tiptap very badly, The Tip tap editor was very hard to understand, Tried doing with other libraries also, but that might not work good with the real time collaboration, So tried and successfully implemented them.
	 8.Next I started Doing features like folder structure
	 9.Placing the children with the Parent, I used backtracking as I was new to react,
  10.Next started doing share, This took me a half day to understand the flow and implement but successfully implemented, don’t know if its correct or not.
     And then started doing real time collaboration. Where I got struck, I thought , Web rtcs or websockets will help me in block wise syncing the data.
  11.I direcly started to do with websockets, I got to impletement the real time collaboration
  12. Next comes the part of cursor. Here is the trouble. Cursors for the many blocks code need XML.fragment!. But tiptap is not allowing me, got many errors, but at last I understood that I should not keep multiple blocks which will improve the complexity of WEB rtcs, 
  13.So started from scratch Again, changed my blocks code, Kept only one block, tried to implement the toolbar, and changed the api endpoints, and the working flow completely.
  14.After changing the code, I tried webrtc’s again, but got the Room issue, as it says that already room exists.
  15. successully completed doing web rtcs also
</pre>

