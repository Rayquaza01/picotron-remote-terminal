build: prt.p64.png

prt.p64.png: cart/main.lua cart/run_program.lua cart/table_to_query.lua
	prt cp -f /external/picotron-remote-terminal/cart /external/picotron-remote-terminal/prt.p64.png
