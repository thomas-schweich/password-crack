## Hashing
This website explains and demonstrates the purpose of hashing passwords.
there are two text fields and a button, plain text, MD5, Commence Hacking. If you enter text into the plain text field and then click the button, the MD5 hash will automatically populate and the website will begin attempting to hack the hash.
may also just put in an MD5 hash and skip the plain text option, to prove it is cracking the hash.
It works through a dictionary attack of the 10 million most popular passwords. It is slow, as dictionary attacks are. for demonstration purposes we recommend using the plain text "pass1Ia" or MD5 "fc7f39edd7b98245a95733a30b7e8cf4"

There is also a check box to submit the password you entered into the database. this will store it and show the last 10 entered passwords below the hacker.

Here is a sample formula for summarizing your activities, talk about:
- the project pertains to cyber security
- The main problem this website addresses is understanding password protection algorithms
- The dictionary algorithm made it possible to visualize the difficulty of hacking MD5 hashes.
- The time it takes for the site to go through the passwords gives a good demonstration of the time brute forcing takes. The text beforehand provides good context.
- There is possibility for this to be further developed as a tool to teach basic cyber security.

## Team and Team Members
Team Hashing
https://hashing-a2.herokuapp.com/

Thomas Schweich  
Alex Hard
Dan Wensley

## Technical Achievements
- **Tech Achievement 1**: Using a dictionary attack algorithm to run through 10 million of the most popular passwords to crack input text
- **Tech Achievement 2**: Usage of a SQL database
- **Tech Achievement 3**: Usage of python scripts to create database and process 10 million passwords

### Design/Evaluation Achievements
- **Design Achievement 1**: Shown in line 92 `hacker.js`, and XMLHTTPSRequest is used to send data about entered passwords
- **Design Achievement 2**: The 10 most recent passwords demonstrate ability to persist entered data
- **Design Achievement 3**: Materialize CSS was used to complete design requirements while providing a feeling of using a terminal to the user

### Team Coordination Activities

- Database Design and initialization
- XMLHTTPSRequests were covered as a group
- Materialize CSS design was coordinated by all members and went through several iterations by each member
- Debugging of dictionary attack was completed by all team members after the lead designer, Thomas, provided in depth explanation of its function. 
