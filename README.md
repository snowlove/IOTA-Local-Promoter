# IOTA Local PoW promoter

Working version online: [http://iota.marshall.haus](http://iota.marshall.haus)

### How do I use this?

----
1) You can download it using the green button "Clone or Download"
2) Click Download Zip
3) Extract files
4) Open LocalPromoter folder and just open the 'index', or 'index.html' you may see it named either way depending on your OS preference.
5) it should open in your default browser and you're ready to go if it says WebGL enabled.

**or** you can use the demo version online at [http://iota.marshall.haus](http://iota.marshall.haus) assuming my server is online, which sometimes admittedly it isn't.

----

* What is this?
	* This will promote/reattach your transactions to speed up confirmation.
* How is this different than Raijvs?
	* This does not require the node you're using to have PoW enabled. IT HAPPENS LOCALLY!

----

**Upcoming:**
* Node failover
* eventually digest live transactions and auto promote transactions that don't naturally confirm after X minutes.
	* This will be optional feature to enable.

**Features:**
* Batch job (New)
* Promote Transactions
* Reattach Transactions
* Find transaction tails (buggy atm)
* Customizable nodes enter the node you wish to connect with.
* All PoW is done locally on your PC, so you don't have to find a node that has PoW enabled. (uses WebGL and utilizes your GPU for PoW)
* PoWer!


Credits: Idea from Rajiv Shah, GpanosXP for his local PoW spammer that uses his iota.extension lib.

Questions? Comments? you can find me in the #help channel on discord the majority of the time.

