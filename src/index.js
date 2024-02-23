#!/usr/bin/env node

const maila = require('maila')

const { compileResults } = require('./compileResults')
const { sendWebhook } = require('./discordWebhook')
let url,appName,webHook;
let mailaArg=processCliArg(process.argv.slice(2));
function processCliArg(argv){
	let filteredArg=argv;
	if(argv.indexOf("--reportUrl")>-1 || argv.indexOf("--appName")>-1 || argv.indexOf("--discordHook")>-1){
		url=argv.indexOf("--reportUrl")>-1 ? argv[argv.indexOf("--reportUrl")+1]:"";
		appName= argv.indexOf("--appName")>-1 ? argv[argv.indexOf("--appName")+1]:"";
		webHook= argv.indexOf("--discordHook")>-1 ? argv[argv.indexOf("--discordHook")+1]:"";
		filteredArg= argv.filter( value => { 
			return value != url && value != '--reportUrl' && value != appName && value != webHook && value !="--discordHook" && value != "--appName";
		});
	}
	
	
	return filteredArg;
		
	
}
(async () => {
	let summary;
	try {
	const runOptions = await maila.cli.parseRunArguments(mailaArg);
	const results = await maila.run(runOptions);
	summary= await compileResults(results);
	
	} catch (error) {
		error.name
		? console.error(
				`${error.name}: ${error.message}`,
				'\nFailed to send Discord message.'
		  )
		: console.error(
				'An unknown error occurred. Failed to send Discord message.'
		  )
	}
	try {
		await sendWebhook({ ...summary, url, appName,webHook})
		console.log('Discord message was sent successfully.')
	} catch (error) {
		error.name
			? console.error(
					`${error.name}: ${error.message}`,
					'\nFailed to send Discord message.'
			  )
			: console.error(
					'An unknown error occurred. Failed to send Discord message.'
			  )
	}
	})()
 

