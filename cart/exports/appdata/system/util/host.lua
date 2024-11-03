cd(env().path)
local argv = env().argv or {}

if #argv > 0 then
	local data = {
		command = table.concat(argv, " "),
		pwd = pwd()
	}

	local q = {}
	for k, v in pairs(data) do
		add(q, string.format("%s=%s", k, v))
	end

	print(fetch("http://localhost:5000/host-command?" .. table.concat(q, "&")))
end
