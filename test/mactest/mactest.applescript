set projectFolder to "/Users/biajee/Documents/Code/LittleNote/"
set binFolder to "test/mactest/moac/"
set solidityFolder to "solidity/"
set jsFolder to "test/mactest/js/"

set LittleNoteSolFile to "littlenote.sol"

set runInit to false
set initSteps to 2
set runNpmInstall to false
set runCompileSol to true
set runMoac1 to true
set runMoac1Console to true


tell application "iTerm"
	activate
	tell current window
		if runInit then
			if initSteps ³ 1 then
				--1) copy all necessary files 
				create tab with default profile
				set init1Tab to current tab
				tell current session of init1Tab
					write text "echo -ne \"\\033]0;\"init1\"\\007\""
					
					write text "cd " & projectFolder & binFolder
					write text "mkdir _logs"
					write text "rm ./_logs/moac.log"
					write text "rm -rf ./data/"
					delay 1
					
					close init1Tab
					delay 1
				end tell
			end if
			if initSteps ³ 2 then
				create tab with default profile
				set init2Tab to current tab
				tell current session of init2Tab
					write text "echo -ne \"\\033]0;\"init2\"\\007\""
					
					write text "cd " & projectFolder & binFolder
					write text "./moac --datadir \"" & projectFolder & binFolder & "/data\" init ./genesis.json"
					delay 3
					
					close init2Tab
					delay 1
				end tell
			end if
		end if
		if runCompileSol then
			create tab with default profile
			set compileTab to current tab
			tell current session of compileTab
				write text "echo -ne \"\\033]0;\"compile\"\\007\""
				
				write text "cd " & projectFolder & jsFolder
				-- 0) run npm install
				if runNpmInstall then
					write text "npm install"
				end if
				-- 1) compile solidity contracts
				write text "node compileScript.js"
			end tell
			delay 1
		end if
		if runMoac1 then
			create tab with default profile
			set moac1Tab to current tab
			tell current session of moac1Tab
				write text "echo -ne \"\\033]0;\"moac 1\"\\007\""
				write text "cd " & projectFolder & binFolder
				write text "./moac --datadir \"" & projectFolder & binFolder & "/data\" --verbosity 4 --networkid 77 --jspath " & projectFolder & jsFolder & " --rpc --rpccorsdomain \"*\""
			end tell
			delay 5
		end if
		if runMoac1Console then
			create tab with default profile
			set moac1aTab to current tab
			tell current session of moac1aTab
				write text "echo -ne \"\\033]0;\"moac 1a\"\\007\""
				write text "cd " & projectFolder & binFolder
				write text "./moac attach ipc:" & projectFolder & binFolder & "data/moac.ipc --jspath " & projectFolder & jsFolder
				delay 1
				write text "personal.newAccount(\"test123\")"
				write text "personal.newAccount(\"test123\")"
				write text "personal.unlockAccount(mc.coinbase, \"test123\", 0)"
				write text "miner.start(2)"
				delay 20
				write text "loadScript('./test.js')"
				write text "fullTest()"
				
			end tell
			delay 1
		end if
	end tell
end tell