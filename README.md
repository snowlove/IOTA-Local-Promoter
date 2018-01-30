# IOTA Local PoW promoter

Working version online: [http://iota.marshall.haus](http://iota.marshall.haus)

* What is this?
	* This will promote/reattach your transactions to speed up confirmation.
* How is this different than Raijvs?
	* This does not require the node you're using to have PoW enabled. IT HAPPENS LOCALLY!

	
Upcoming:
* Batch promote (Feed it a list of hashes and it'll go to work.)
* Node failover
* eventually digest live transactions and auto promote transactions that don't naturally confirm after X minutes.
	* This will be optional feature to enable.

Features:
* Promote Transactions
* Reattach Transactions
* Find transaction tails (buggy atm)
* Customizable nodes enter the node you wish to connect with.
* All PoW is done locally on your PC, so you don't have to find a node that has PoW enabled. (uses WebGL and utilizes your GPU for PoW)
* PoWer!


Credits: Idea from Rajiv Shah, GpanosXP for his local PoW spammer that uses his iota.extension lib.

Questions? Comments? you can find me in the #help channel on discord the majority of the time.

