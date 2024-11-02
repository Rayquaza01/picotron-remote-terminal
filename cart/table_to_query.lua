--[[pod_format="raw",created="2024-11-02 03:42:29",modified="2024-11-02 15:03:13",revision=138]]
-- https://smolkit.com/blog/posts/how-to-url-encode-in-lua/
-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#description
-- picotron seems to encode the uri automatically? doing this double encodes it
--function encode_uri_component(uri)
--	return uri:gsub("([^%w%.%-_!~*'%(%)])", function(c)
--		return string.format("%%%02x", string.byte(c))
--	end)
--end

function table_to_query(tbl)
	local q = {}
	for k, v in pairs(tbl) do
		add(q, string.format("%s=%s", k, tostr(v)))
	end

	return table.concat(q, "&")
end