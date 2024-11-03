cd(env().path)
local argv = env().argv or {}

if #argv > 0 then
	local data = {
		command = table.concat(argv, " "),
		pwd = pwd()
	}

	if data.command == "prt-shutdown" then
		print("Shutting down prt-server")
		fetch("http://localhost:5000/shutdown")
		exit(0)
	end

	local q = {}
	for k, v in pairs(data) do
		add(q, string.format("%s=%s", k, v))
	end

	print(fetch("http://localhost:5000/host-command?" .. table.concat(q, "&")))
end
