--[[pod_format="raw",created="2024-03-15 13:58:36",modified="2024-11-02 15:03:13",revision=871]]
-- picotron remote terminal v1.0
-- by Arnaught

include("run_program.lua")
include("table_to_query.lua")

function _init()
	window({
		width = 256, height = 128,
		title = "PRT"
	})

	cd("/")

	path = {
		"/system/apps",
		"/system/util",
		"/appdata/system/util",
		"."
	}

	exe_extensions = {
		".lua",
		".p64",
		".p64.png",
		".rom"
	}

	res = nil

	print("\ftPicotron Remote Terminal")
	print("\f7Listening for commands on localhost:5000/remote")
end

function _update()
	data = {
		pwd = pwd(),
		pid = pid()
	}

	if co == nil or costatus(co) == "dead" then
		co = cocreate(fetch)
		_, res = coresume(co, "http://localhost:5000/remote?" .. table_to_query(data))
	end

	if costatus(co) != "dead" then
		_, res = coresume(co)
	end
end

function _draw()
	if res != nil then
		cls()

		print("\ftPicotron Remote Terminal")
		print("\f7Polling for commands from localhost:5000/remote")

		local cmd_text = res
		local cmd_lines = split(res, "\n", false)
		if #cmd_lines > 1 then
			cmd_text = cmd_lines[1] .. "..."
		end

		print(string.format("%s> %s", pwd(), cmd_text))

		local cmd = split(res, " ", false)
		local progname = cmd[1]
		deli(cmd, 1)

		local command_path = resolve_program_path(progname)

		if progname == "exit" then
			exit()
		elseif progname == "cd" then
			local result = cd(cmd[1])
			if result then
				print(result)
			else
				print(string.format("%s>", pwd()))
			end
		elseif command_path then
			create_process(command_path, {
				print_to_proc_id = pid(),
				argv = cmd,
				path = pwd(),
				window_attribs = {show_in_workspace = true}
			})
		else
			run_lua(res)
		end
	end
end
