# Objectives
By completing this assignment, students will:
1. Create a web application following modern web development best practices using asynchronous JavaScript and REST APIs
2. Create content dynamically based on user interaction
3. Implement complex click events using delegation
4. Maintain a web application state based on user interaction and server responses 
# Overview
The final product of this Assignment will be a simple sorting game for 1 player. The game will use an open REST API for the images and metadata needed. You will determine the endpoints and values you need depending on the game your choose to make.

Optionally, you will use local browser storage to keep track of high scores and game state.

The game will be a sorting card game. You will give the player a set of shuffled cards which they will sort based on some data field from your chosen API. This game must have:
- A set of face-up cards each with distinct values for some sortable data (e.g., year created, popularity, worth), but this data is hidden from the user
	- cards could be displayed in a line, carousel, etc
- Dragging gestures (with the mouse) so the player can drag cards onto and off of some sorted area of the game board. To win, they will do this in the correct order from least to most (e.g., painting with earliest year completed to painting with latest year completed) trying to get the order exactly right
# Approved APIs

1. Art institute of Chicago :https://api.artic.edu/docs/#introduction
2. NASA EPIC (satellite pictures of earth): https://epic.gsfc.nasa.gov/about/api
3. Pokemon: https://pokeapi.co/docs/v2
4. Books: https://gutendex.com/
5. Science Museum: https://github.com/TheScienceMuseum/collectionsonline/wiki/Collections-Online-API

# Required Web Page Elements
By the end of the this assignment (not today), your website will have all of these features implemented (well, maybe not the optional ones)

Read through this list and then the next section will describe what to work on today.
## 1. Initial page state
The first time the page loads, there should be some explanation of the game and a way to trigger the start of the first game. This page will also show some example images from your chosen API that **will not** be part of the game itself.
## 2. API fetching and error handling
The data and images for the game need to be fetched asynchronously from one of the approved APIs and must include images.

If the fetched data is missing an image, there should be some backup data displayed (such as the title of the artwork) or a replacement item should be fetched from the API. (beware of getting stuck fetching endlessly if too much data is missing!)

You must determine which key/value pair(s) you can use for sorting the cards part of the game from the API you've chose (e.g., distance, year created, size, etc)

While waiting for a response, the website should show in some way that there is data loading; either for the whole page or for a single card
## 3. Dynamic JS
The cards for game play need to be dynamically generated from the data fetched from the API.

The cards will be moved around the game board by dragging, using delegated event listeners and appropriate mouse events to handle drag and drop gestures

The current parameters for the game (especially what the player needs to sort the cards by) needs to be displayed to the user.
## 4. Determining Win State
When all the cards have been sorted, the game should check if the player has won and display a score (if they won) or indicate which cards are wrong (if they haven't won).

## 5. Optional
You'll hear more about these in labs 2 and 3
# Day 1: What we're working on today:

## In Lecture
You should have already figured out:
- Which API to use and what a card in your game will be
- Some basic wireframes for your game including:
	- What the game looks like when it starts (after the welcome screen)
	- What the game looks like part way solved
- What endpoint(s) you'll need to start with
## In Lab:
Start with some very basic HTML and CSS for the game page. **Not** the welcome/start game page.

Really. Just do the bare minimum so your API response data has somewhere to be displayed. You can make it pretty later I promise.

The main focus for today is to get an asynchronous fetch/fetches to your chosen API working and parsing the response to get the key/value pairs you want

AND using that response, fill in a set of unsorted cards that you have dynamically generated. Remember to handle errors as well: missing images, broken urls, etc. 
### Required Elements:
- [ ] Basic HTML/CSS for the game play area:
	- [ ] Place for unsorted cards
	- [ ] Place for sorted cards
	- [ ] Dynamically generating N unsorted cards (you choose what N is) and placing them in the unsorted cards area
	- [ ] Dynamically generating N empty sorted cards and placing them in the sorted area
- [ ] First fetch call
	- [ ] Fetch as many data points as you have cards to sort (this might be one or several calls depending on your API)
	- [ ] Use that data to add an image to each of the **unsorted** cards
		- the sorted cards stay empty for now
	- [ ] If an image isn't available or fails to load, how will you handle it?
		- \<img> elements can have an error event that triggers when an image fails to load

## Before Next Lab (if you feel like it)
If you want to keep working on this assignment before next lab, you can as long as you provide me **at least** 2 detailed commit messages explaining and documenting your steady progress.

I recommend first completing all the above steps, and then working on making the CSS as beautiful as you like. For the CSS, consider the different possible states for the game card elements: sorted or not sorted and empty or not empty

I **do not** recommend working on the other parts of the assignment before next lab as you won't have the full requirements before then and I won't be able to quickly help you troubleshoot.
## Submission
The assignment will be created, managed, and submitted through gitlab. You will create a project at the start of the first lab and will document your progress through frequent commits.

You **must** commit all changes at the end of each lab. If you choose to work on the assignment between the labs, you **must** have at least 2 commits with detailed messages explaining your progress. **MISSING COMMITS OR INCOMPLETE COMMIT MESSAGES WILL RESULT IN A DEDUCTION FOR THE ASSIGNMENT.** Additionally, your teacher may ask you to explain particular parts of your code to demonstrate your understanding of the code.

At the end of the 3rd lab, you will submit the **complete** project by creating a new commit and pushing to the main branch.