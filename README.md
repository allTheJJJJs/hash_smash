<h1 align="center">
  <br>
  <img src="./assets/broken-hashtag.png" width="700">
  <br>
  <img src="./assets/title.png" width=60%>
  <br>
</h1>

<h4 align="center">Welcome to the Hash Smash API Test Harness!</h4>

<p align="center">
  <img src="https://img.shields.io/github/stars/allTheJJJJs/hash_smash.svg" />
  <img src="https://img.shields.io/badge/version-1.0.0-green.svg" />
  <img src="https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg" alt="Dependencies" />
  <img src="https://img.shields.io/github/issues/allTheJJJJs/hash_smash.svg" alt="GitHub Issues" />
</p>

<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#features">Features</a> •
  <a href="#setup">Setup</a> •
  <a href="#how-to-use">How to Use</a> •
  <a href="#test-strategy">Test Strategy</a> •
  <a href="#additional-considerations">Additional Considerations</a>
</p>

![Alt Text](http://recordit.co/IuMeJ1zcrm.gif)
<h4 align="center">(Click to embiggen)</h4>

## Introduction

This test automation harness was designed to solve the challenges of developing and executing tests against the hash-serve application across the Windows, Linux, and macOs platforms.

The goal for this harness is to handle environment configurations and setup for the user so you can quickly and easily develop your automation tests, with a focus on usability and the user-experience.

If this harness is not true to that vision, then open an [Issue](https://github.com/allTheJJJJs/hash_smash/issues/new) please!

## Features

- Supports development and testing in Windows, Linux, and macOS
- Handles test configuration and execution from a single command
- Containerized Docker Solution (Coming Soon...)
- AWS testing (Coming Soon...)

## Setup

#### Install IDE

Grab an IDE of your choice:

 [Atom](https://atom.io/) 

 [<img src="./assets/atom.png" width=60%>](https://atom.io)
 
___
 [Visual Studio Code](https://code.visualstudio.com/)

 [<img src="./assets/vscode.png" width=60%>](https://code.visualstudio.com/)

#### Install Node.js

Next, you'll need to install Node.js.

For `Linux`, use the following commands:
```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```
___
For` macOS`, use either:
```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```
or the simpler
```bash
brew install node
```
___
For `Windows`, use the Windows Installer from nodejs.org, found [HERE](https://nodejs.org/en/), or `scoop` in `PowerShell`:
```
scoop install nodejs
```
#### Clone the Repo
Now clone or download the repo, like so:

```bash
git clone git@github.com:allTheJJJJs/hash_bash.git
```

Or click on the pretty green download button!

<img src="./assets/git-download.png" />

#### Install NPM Modules

Lastly, let's install all the project dependencies! You can install them from the `terminal` or `command line`, like so:
```bash
npm install
```

## How to Use

You will need to assign the `ENVIRONMENT` variable with your current env: windows, linux, or mac.

From your terminal, while inside the project directory, simply type:

```
ENVIRONMENT=<environment> npm test
```

Where `<environment>` can either be `windows`, `linux`, or `mac`.

For Example,
```
ENVIRONMENT=windows npm test
```

That's it! Now go test some stuff!

## Test Plan

I chose to start with `Functional Testing` around the reqs minimum viable project. The tests 'Minimum Valid Request' were designed to address this functional testing.

I then focused on `Negative Testing` around the basic functionality to determine if failures were graceful, followed by functional edge cases.

Next was `Security Testing`, like being able to pass query params to see how they are handled. It's important to see if they are processed, rejected,sanitized out gracefully, etc. If they are processed, then sql-injection and xss are serious concerns. Because there were no credentials required or passed to allow or reject the calls, I couldn't test anything around 401 and 403 failures - this should be addressed before going to prod.

I then looked at`Acceptance Testing` to ensure, though the product may be functionally sound, it meets the product goals outlined in the reqs. I wrote a few tests targeting acceptance, though not necessarily functionality. For example, though there's a good chance the Base64 encoded charset is SHA512, since it's 512 bits long, it's certainly not a UTF-8 charset, which is likely the goal of the app. This would need further clarification before going to prod.

Lastly was `System Testing`, to see if the test automation solution and broken-hashserve worked across the multiple platforms for which they were designed.

## Additional Considerations

Given more time to test, and the ability to ask Product questions about this application, I'd like to know more about the following:

Performance - What should we expect the response time to maintain at a minimum? Should request throttling be present?
Load - How should this application respond under very high load?
Stress - How should this application respond when fewer resources are available to process requests(fewer threads, server resources, etc.)?
Integration - What applications should this integrate with? How should this communicate with other microservices or a front-end application?
Usability - Is this user-friendly and easily consumed? Should we want more than merely the number of requests and avg. time? Should the number of requests be limited to ONLY successful calls(it currently increments TotalRequests even if the response is considered Malformed Content)?

I also would test the 'shutdown' functionality more - time constraints limited the number of automated tests around processing requests in shutdown process, among others.