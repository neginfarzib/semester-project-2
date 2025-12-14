# Semester Project 2

This is an auction/bidding application where make it possible for all users to explore listing from others, view seller. Ends at, Bid history, and short description. If user is intrested can clicking on a listing for more details and view more images for the listing. 
User need to be registered and authenticated to 
- Place a Bid
- Create Listing
- Edit profile
- View the listiing he/she has placed bid
- View the listing which wins auction

## Table of Contents
- [Installation](#installation)
- [Technologies](#technologies)
- [Description](#description)

## Installation
Steps to run the project locally:

```bash
git clone https://github.com/username/repository-name.git
cd repository-name
npm install
```
Then to follow changes and automatic update
```bash
npm run watch
```
Also need to click on "Go Live" extention on VC Code. As long as the port 5500 is not occupied, the web site is available on 
http://127.0.0.1:5500/

## Technologies
- Bootstrap via node_modules
- Vanila JavaScript
- HTML
- SCSS, CSS

## Description
Without registeration:
- User can browse others listing and see a listing details by clicking on one.
User are able to see 
    - Seller
    - Published On
    - End At
    - Bid history
    - Able to see "Place bid" ❌ but as soon as what to place bid, it will as to login first if the user is not already logged in

After Authentication
- User alway see availale credit next to his/her name
    - Credit automacitally is updated after user place a bid
    - After user is authenticated can Place a bid
        - There is several checks to accept bid
- By clicking on his/her name will be redirected to the profile page there the user can
    - Edit Profile 
        - View Name (cannot edit)
        - View email (cannot edit)
        - Edit Bio
        - Edit Avatar
        - Edit Banner
    - Create Listing
    - View My Listing
        - Edit
            - Cannot edit End Date ❌
        - View
            - View/click on all images 
            - See Seller
            - Published on
            - End At 
            - Bid History
        - Delete
    - View My Bids
    - View My Wins
