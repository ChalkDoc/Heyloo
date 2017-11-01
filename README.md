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

1.	Teacher logs in on the Login Page (Email log in supported)
2.	On login success, teach taken to HIS Admin Page. Page should show status of previous rooms, some finished (scores recorded), some live.
3.	Teacher selects Create New Quiz button which redirects to the First Quiz Creator Page.
4.	On the First Quiz Creator Page, the teacher fills out the form with the quiz name before continuing to the Second Quiz Creator Page by clicking the “ok, go” button.
a.	Description text also required – ignored for now
b.	Audience drop down also required – ignored for now
5.	On the Second Quiz Creator Page, the teacher clicks the “Add Question” button to be redirected to a Question Content Form Page.
6.	On the Question Content Form Page, the teacher adds the text for the question, and adds the text for at least 2 answer options with the correct answer identified with a check button. The user clicks the “next” button once completing the question which returns them to the Second Quiz Creator Page where they have the option to edit or delete any questions added, or create another question.
7.	Once the teacher has finished making questions, they click on the “save” button on the Second Quiz Creator Page which redirects them to the Quiz Summary Page.
8.	On the Quiz Summary Page the teacher is shown the title of the quiz and a count of the number of questions it contains. The teacher also has 3 button options: “edit it” takes the teacher back to the Second Quiz Creator Page; “I’m done” takes the teacher back to their Admin Page where they can see the newly created quiz listed; “play it” opens a new tab with the Play Quiz Landing Page and takes the teacher there.
9.	Teacher presses the “play it” button on the Quiz Summary Page or from the Admin Page.
10.	Student goes to the Student Register Page and enters name and room code from teacher's projector view.
11.	Student is placed in Joined Confirmation Page, teacher is notified that student has joined on the Play Quiz Landing Page.
12.	Teacher starts game by pressing “Start game” button.


# QUESTION LOOP
* Counted of 5 seconds to start of question, students screen is blank.

* Question is displayed alone for 10 seconds.  Students screen is blank
* Teacher's display shows question and 4 possible answers.  A countdown of 30 seconds shows how long students can vote. During this time students view shows 4 buttons and can vote for an answer once.  Once the vote is registered, the page notifies the student that their vote was cast.   After 30 seconds, If no vote is given the screen notifies student no vote was recorded.
* Screen changes to results page for that question.  Student Results page shows total points for the user for that question, or if no vote was given and current ranking (3rd out of 7 students) in total.  At same time, teachers view shows a histogram of student votes for the question among the 4 possible answers.  Options here: Start Next question, or end game.

Repeat these steps for each question

END OF GAME

Teacher screen taken to the final scoreboard showing the winner.


## How to Deploy Heyloo to Firebase Hosting

1. Install the Firebase tools globally using `npm install -g firebase-tools`, make sure to navigate to the project root folder (where package.json is located)
2. Type `firebase login`, and it will require you to login to Firebase via a browser window.
3. Type `firebase init` to start the project tool.  This allows you to configure hosting.  Select Hosting in the menu, and press enter.
4. On the next menu associate the hosting to an existing Firebase project.  Select it in this list and press enter.
5. On the next menu it asks you what folder to use as public.  Type `dist` and press enter.  Make sure you've built the folder using `ng build`
6. When it asks to rewrite all urls to /index.html answer Y (yes) and press enter.
7. When it asks to overwrite index.html answer n (No)

At this point your Firebase project will be prepared to be hosted.  To deploy the project go to the next step.

8. Type `firebase deploy` to start the deployment process using the Firebase CLI tool.  There is no steps required here, it should just upload and work!
