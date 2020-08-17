## Project Description

A bank api system which manages user’s account information.A customer of this bank can invoke the following operations -
1. Deposit (this operation increases the balance of user account by a given amt).
2. Withdraw (this operation decreases the balance of user account by given amt).
3. Enquiry ( this operation returns the balance of user account etc).
4. Customer will receive emails on transactions.
5. The bank manager will be able to download excel of transaction histories for a specific time period for individual/a collection of customers.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).

## Development tools 
- Postman
- VsCode (Editor)

## Installing
- `git clone https://github.com/tanmaydhakar/bankSystem.git`
- `cd bankSystem`
- `npm i`

## Configure app
Open `bankSystem/config/config.json` then edit it with your settings.

## Running the project
```
node index
```