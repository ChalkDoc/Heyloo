# Heyloo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.0. It was created by Kory Skarbek and Melvin Gruschow for Steve Walker as part of our internship from Epicodus.  This application was designed to run parallel and integrate with the ChalkDoc website, taking in math assignment plans and turning it into a game similar to that of the quiz game Kahoot.  

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

Go into the environment files and set the credentials to match with your own firebase account.  Dont forget to add this file to the gitignore to maintain security.  

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Things to polish
The music that is used comes from bensound.com/royalty-free-music and should be noted somewhere on the website of its use.  

## Minimum Viable Product Requirements

1. Teacher logs in (Email log in supported)
2. On login success, teach taken to HIS Admin page.  Page should show status of previous rooms, some finished (scores recorded), some live.  Admin page should have ability to create a quiz.

**********
Laura ADD Minimum Quiz creation steps here
***********

3. Teacher creates a room and room is created.
4. Student goes to Register page and enters name and room code from Teachers projector view.
6. Student is placed in confirmation page, teacher is notified that student has joined.
7. Teacher starts game by pressing Start game button.

# QUESTION LOOP
* Counted of 5 seconds to start of question, students screen is blank. 

* Question is displayed alone for 10 seconds.  Students screen is blank
* Teacher's display shows question and 4 possible answers.  A countdown of 30 seconds shows how long students can vote. During this time students view shows 4 buttons and can vote for an answer once.  Once the vote is registered, the page notifies the student that their vote was cast.   After 30 seconds, If no vote is given the screen notifies student no vote was recorded. 
* Screen changes to results page for that question.  Student Results page shows total points for the user for that question, or if no vote was given and current ranking (3rd out of 7 students) in total.  At same time, teachers view shows a histogram of student votes for the question among the 4 possible answers.  Options here: Start Next question, or end game.

Repeat these steps for each question

END OF GAME

Teacher screen taken to the final scoreboard showing the winner.
