// Iota api extensions
// Script originally for IOTA SpammerXP. Used for local PoW for promotions -snowlove
// https://github.com/GpanosXP/IOTA-SpammerXP

/// Promisified version of IOTA api functions

    IOTA.prototype.getTipsAsync = function()
    {
        return new Promise((resolve, reject) => {
            this.api.getTips((error, tips) => error ? reject(error) : resolve(tips))
        });
    };

    IOTA.prototype.getNodeInfoAsync = function()
    {
        return new Promise((resolve, reject) => {
            this.api.getNodeInfo((error, nodeInfo) => error ? reject(error) : resolve(nodeInfo))
        });
    };

    IOTA.prototype.prepareTransfersAsync = function(seed, transfers, options)
    {
        return new Promise((resolve, reject) =>
            this.api.prepareTransfers(seed, transfers, options, (error, trytes) => error ? reject(error) : resolve(trytes))
        );
    };

    IOTA.prototype.getTransactionsToApproveAsync = function(depth)
    {
        return new Promise((resolve, reject) =>
            this.api.getTransactionsToApprove(depth, (error, toApprove) => error ? reject(error) : resolve(toApprove))
        );
    };

    IOTA.prototype.getTransactionsObjectsAsync = function(hashes)
    {
        return new Promise((resolve, reject) =>
            this.api.getTransactionsObjects(hashes, (error, txObjects) => error ? reject(error) : resolve(txObjects))
        );
    };

    IOTA.prototype.attachToTangleAsync = function(trunkTransaction, branchTransaction, minWeightMagnitude, trytes)
    {
        return new Promise((resolve, reject) =>
            this.localAttachToTangle(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, (error, attached) => error ? reject(error) : resolve(attached))
        );
    };

    IOTA.prototype.storeAndBroadcastAsync = function(trytes)
    {
        return new Promise((resolve, reject) =>
            this.api.storeAndBroadcast(trytes, (error, report) => error ? reject(error) : resolve(report))
        );
    };

/// Local PoW wrapper function

    const MAX_TIMESTAMP_VALUE = (Math.pow(3,27) - 1) / 2 // from curl.min.js
    curl.init();

    // adapted from https://github.com/iotaledger/wallet/blob/master/ui/js/iota.lightwallet.js
    IOTA.prototype.localAttachToTangle = function(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) {
        const iotaObj = iota;
        const ccurlHashing = function(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) {

            // inputValidator: Check if correct hash
            if (!iotaObj.valid.isHash(trunkTransaction)) {
                return callback(new Error("Invalid trunkTransaction"));
            }

            // inputValidator: Check if correct hash
            if (!iotaObj.valid.isHash(branchTransaction)) {
                return callback(new Error("Invalid branchTransaction"));
            }

            // inputValidator: Check if int
            if (!iotaObj.valid.isValue(minWeightMagnitude)) {
                return callback(new Error("Invalid minWeightMagnitude"));
            }

            var finalBundleTrytes = [];
            var previousTxHash;
            var i = 0;

            function loopTrytes() {
                getBundleTrytes(trytes[i], function(error) {
                    if (error) {
                        return callback(error);
                    } else {
                        i++;
                        if (i < trytes.length) {
                            loopTrytes();
                        } else {
                            // reverse the order so that it's ascending from currentIndex
                            return callback(null, finalBundleTrytes.reverse());
                        }
                    }
                });
            }

            function getBundleTrytes(thisTrytes, callback) {
                // PROCESS LOGIC:
                // Start with last index transaction
                // Assign it the trunk / branch which the user has supplied
                // IF there is a bundle, chain  the bundle transactions via
                // trunkTransaction together

                var txObject = iotaObj.utils.transactionObject(thisTrytes);
                txObject.tag = txObject.obsoleteTag;
                txObject.attachmentTimestamp = Date.now();
                txObject.attachmentTimestampLowerBound = 0;
                txObject.attachmentTimestampUpperBound = MAX_TIMESTAMP_VALUE;
                // If this is the first transaction, to be processed
                // Make sure that it's the last in the bundle and then
                // assign it the supplied trunk and branch transactions
                if (!previousTxHash) {
                    // Check if last transaction in the bundle
                    if (txObject.lastIndex !== txObject.currentIndex) {
                        return callback(new Error("Wrong bundle order. The bundle should be ordered in descending order from currentIndex"));
                    }

                    txObject.trunkTransaction = trunkTransaction;
                    txObject.branchTransaction = branchTransaction;
                } else {
                    // Chain the bundle together via the trunkTransaction (previous tx in the bundle)
                    // Assign the supplied trunkTransaciton as branchTransaction
                    txObject.trunkTransaction = previousTxHash;
                    txObject.branchTransaction = trunkTransaction;
                }

                var newTrytes = iotaObj.utils.transactionTrytes(txObject);

                curl.pow({trytes: newTrytes, minWeight: minWeightMagnitude}).then(function(nonce) {
                    var returnedTrytes = newTrytes.substr(0, 2673-81).concat(nonce);
                    var newTxObject= iotaObj.utils.transactionObject(returnedTrytes);

                    // Assign the previousTxHash to this tx
                    var txHash = newTxObject.hash;
                    previousTxHash = txHash;

                    finalBundleTrytes.push(returnedTrytes);
                    callback(null);
                }).catch(callback);
            }
            loopTrytes()
        }

        ccurlHashing(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, function(error, success) {
            if (error) console.log(error);
            //else console.log(success);
            if (callback) return callback(error, success);
            else return success;
        });
    }
