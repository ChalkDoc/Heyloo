# Heyloo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.0. It was created by Kory Skarbek, Melvin Gruschow, Steve Zaske, Witty Chang, and Laura Hamilton for Steve Walker as part of our internship from Epicodus.  This application was designed to run parallel and integrate with the ChalkDoc website, taking in math assignment plans and turning it into a game similar to that of the quiz game Kahoot.  

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
When running for the first time, you may need to run `npm install`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

Go into the environment files and set the credentials to match with your own firebase account.  Don't forget to add this file to the gitignore to maintain security.  

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

<!-- ## Things to polish
The music that is used comes from bensound.com/royalty-free-music and should be noted somewhere on the website of its use.   -->

## Minimum Viable Product Requirements

1.	Teacher presses Heyloo button on ChalkDoc worksheet and the application opens as a new browser window or tab.
2.	On the start page, the teacher selects the Create Room button which creates a new room code number and redirects to the host waiting room for the quiz.
3.	Teacher: The host waiting room displays the newly created room code number for the students to join and lists out the students' names as they join.
Students: Students see the registration page to input their name and room code, and after the student presses the Register button before displaying a confirmation telling the student they have joined, and gives instructions to wait.

## Question Cycle

1.	Teacher: Teacher presses the Let's begin! button within the host waiting room as is directed to the first countdown phase which begins counting down to the first question.
Students: Screen display's nothing.
2.  Teacher: After the countdown is complete, the pre-question phase starts with only the question and prompt displayed and the pre-question countdown begins.
Students: Screen display's nothing.
3.  Teacher: After the pre-question countdown is completed, the teacher enters the question phase which also has a countdown and displays answer choices below the question and prompt.
Students: Screen display's the answer choice buttons, and if pressed, they are redirected to a confirmation page confirming their answer was received.
4.  Teacher: Once the question countdown completes or all of the registered students have answered, the page enters the answer phase which displays a chart showing the distribution of the answers as well as highlighting the correct one.
5.  Students: If the student answered correctly, they are taken to a progress page notifying them that they selected the right answer, the points earned from the question, their total points, and their position relative to the class. If they answered incorrectly, they are taken to the same progress page, but they are told they chose an incorrect answer and are awarded no points.
6.  Teacher: Within the answer page, the teacher is given the option to continue to show the question and possible answers again, move on to the next question, view the current leaderboard of students, or end the quiz.
Students: Their current progress page is displayed after any button option, except end game button which changes their progress page to show their overall score for the game up to that point and notifies the student that the game is over. The student is also given a return to home button to return to the registration page.
7.  The next question begins with a countdown and continues through the question cycle until all the questions are covered, or is ended early by the teacher. Upon completion of the game the teacher is taken to a final leaderboard showing the top student.

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
