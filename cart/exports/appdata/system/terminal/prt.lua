-- PRT Module for use with PUSH
-- https://github.com/Rayquaza01/picotron-upgraded-shell/

local fetch_cor = nil
local prt_status = "stopped"

local function table_to_query(tbl)
	local q = {}
	for k, v in pairs(tbl) do
		add(q, string.format("%s=%s", k, tostr(v)))
	end

	return table.concat(q, "&")
end

local function update(v)
	if prt_status == "running" then
		if fetch_cor == nil then
			fetch_cor = cocreate(fetch)
		end

		if costatus(fetch_cor) == "dead" then
			fetch_cor = cocreate(fetch)
		end

		if costatus(fetch_cor) ~= "dead" then
			local data = { pid = pid(), pwd = pwd() }

			_, res = coresume(fetch_cor, "http://localhost:5000/remote?" .. table_to_query(data))

			if res ~= nil then
				add_line(v.get_prompt()..res)
				v.run_terminal_command(res)
			end
		end
	end
end

local function prt(argv)
	if #argv < 1 then
		add_line("Accepted commands: start, stop, restart, shutdown, status")
	elseif argv[1] == "start" then
		add_line("Starting PRT")
		prt_status = "running"
	elseif argv[1] == "stop" then
		add_line("Stopping PRT")
		fetch_cor = nil
		prt_status = "stopped"
		fetch("http://localhost:5000/close")
	elseif argv[1] == "restart" then
		add_line("Restarting PRT")
		fetch_cor = nil
		fetch("http://localhost:5000/close")
	elseif argv[1] == "shutdown" then
		add_line("Shutting down PRT Server")
		fetch_cor = nil
		prt_status = "stopped"
		fetch("http://localhost:5000/shutdown")
	elseif argv[1] == "status" then
		add_line("PRT is " .. prt_status)
	else
		add_line("Accepted commands: start, stop, restart, shutdown, status")
	end
end

return {
	update = { update },
	commands = {
		prt = prt
	}
}
