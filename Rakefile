#!/usr/bin/env rake

desc "Start the server"
task :server do
	# Using 'exec' here instead of backticks so
	# I can see the output of the command
	exec( "nodemon server.js" )
end

desc "Nyan cat runs tests"
task :nyan do
	run_mocha_tests('nyan')
end

desc "Run tests with useful output (optionally specify reporter)"
task :test, :reporter do |t, args|
	reporter = args[:reporter] || 'spec'
	run_mocha_tests(reporter)
end


def run_mocha_tests( reporter )
	mocha_cmd = "./node_modules/.bin/mocha"
	options = [
		"--reporter #{reporter}",
		"--inline-diffs",
		"--recursive"
	].join(" ")
	files = "./test/*.js"

	cmd = [mocha_cmd, options, files].join(' ')

	exec( cmd )
end
