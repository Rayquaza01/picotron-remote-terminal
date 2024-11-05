--[[pod_format="raw",created="2024-11-02 02:49:22",modified="2024-11-02 15:03:13",revision=164]]
function resolve_program_path(progname)
	if fstat(progname) then
		for e in all(exe_extensions) do
			-- if endswith extension
			if progname:sub(-#e) == e then
				return progname
			end
		end
	end

	for p in all(path) do
		local files = ls(p)
		for f in all(files) do
			for e in all(exe_extensions) do
				if f == progname..e then
					return p .. "/" .. f
				end
			end
		end
	end

	return false
end

-- adapted from try lua block in /system/apps/terminal.lua
function run_lua(script)
	local f, err = load(script, nil, "t", _ENV)

	if f then
		local cor = cocreate(f)
		repeat
			local _, coerr = coresume(cor)

			if err then
				print("Runtime Error")
				print(coerr)
			end

		until costatus(cor) != "running"
    elseif err then
		local near_msg = "syntax error near"
		if (near_msg == sub(err, 5, 5 + #near_msg - 1)) then
			-- caused by e.g.: "foo" or "foo -a" or "foo a.png" when foo doesn't resolve to a program
			print("command not found")
		else
			print(err)
		end
	end
end
