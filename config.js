if(process.env.ENVIRONMENT == 'windows'){
    server = 'win_serve.bat';
} else if (process.env.ENVIRONMENT == 'linux') {
    server = 'linux_serve';
} else if (process.env.ENVIRONMENT == 'mac') {
    server = 'darwin_serve';
} else {
    console.log("\x1b[42m%s\x1b[0m", "Your ENVIRONMENT variable must be set to continue testing.\n" +
    "Usage: ENVIRONMENT=<environment>\n" +
    "Currently supported environments for testing are: windows, linux, and mac.\n" +
    "For Example: ENVIRONMENT=mac npm test");
    process.exit();
}