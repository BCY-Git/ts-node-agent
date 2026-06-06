import chalk from "chalk";

export function logTitle(message:string){
    const totalLength = message.length + 4;
    const border = chalk.gray("─".repeat(totalLength));
    console.log(chalk.gray(border));
    console.log(chalk.white(message));
    console.log(chalk.gray(border));
}