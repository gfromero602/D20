const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const fs = require("fs");

client.spells = require("./spells.json");

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    //console.log(message.content);
    //console.log(message.author.username)
    
    if(message.content.startsWith(`${prefix}roll`)) {

        let user = message.member.displayName;

        let roll = message.content.substring(5).trimLeft();
        console.log(user + " rolls a " + roll)

        if (roll == "") {
            roll = 20
        }

        try {

            let result = d20.roll(roll)

            if (result == "1") {
                result = result + ". OOF. :poop:"
            }
    
            console.log("They rolled a " + result)    
            message.channel.send(":game_die: " + user + " rolled a " + result)

        } catch(error) {
            console.log("Failed roll: " + error)
    
            message.channel.send(user + " doesn't know how to roll. type /d20help for instructions")
        }
        
    } else if(message.content.startsWith(`${prefix}d20help`)) {

        message.channel.send("To submit a roll, type \"\/roll\ \{dice to roll\} \{modifiers\}\""
        + "\nFor example: \"/roll 2d4+10\" will roll 2 d4 dice, and add a 4 modifier"
        + "\nTips\: \"/roll\" will default to rolling 1d20"
        + "\nTips\: \"/\" will also perfrom as \"\/roll\". i.e. \"\/4d6\" will roll 4 d6."
        + "\nAnd pay Gus for his troubles.")
        
    } else if(message.content.startsWith(`${prefix}`) && message.content.trim().length > 1) {

        let user = message.member.displayName;

        let roll = message.content.substring(1).trimLeft();
        console.log(user + " rolls a " + roll)

        if (roll == "") {
            roll = 20
        }

        try {

            let result = d20.roll(roll)

            if (result == "1") {
                result = result + ". OOF. :poop:"
            }

            if (result == "0NAN") {

                spellname = message.content.slice(1).toLowerCase().replace(/\s+/g, '');

                var ind = 0
                var found = false
                for (var i = 0; i < client.spells["spell"].length; i++) {

                    if (client.spells["spell"][i].name.toLowerCase().replace(/\s+/g, '') == spellname) {
                        ind = i
                        found = true
                    }
                }

                if (found) {
                    message.channel.send("Name: " + client.spells["spell"][ind].name
                    + " - Level: " + client.spells["spell"][ind].level
                    + "\nText: " + client.spells["spell"][ind].text)
                } else {
                    console.log("They rolled no dice")
                    message.channel.send(user + " rolled no dice. Type /d20help for help.")
                }

            } else {
                console.log("They rolled a " + result)    
                message.channel.send(":game_die: " + user + " rolled a " + result)
            }

        } catch(error) {
            console.log("Failed roll: " + error)    
            message.channel.send(user + " doesn't know how to roll. type /d20help for instructions")
        }        
    }

    if(message.content.startsWith("Fuck you ")) {
        message.channel.send("Yeah! Fuck you " + message.content.slice(9) + " (╯°□°）╯︵ ┻━┻")
    }

    
})


client.login(token);


var d20 = {

    /**
     * Roll a number of dice and return the result.
     *
     * @param dice Type of dice to roll, can be represented in various formats:
     *               - a number (6, 12, 42)
     *               - dice syntax (d20, 4d6, 2d8+2)
     * @param verbose Whether or not all dice rolls should be returned as an array
     * @return Number|Array
     */
    roll: function(dice, verbose) {
        var result = d20.verboseRoll(dice),
            num = 0;

        if(verbose) {
            return result;
        } else {
            for (var i in result) {
                num += result[i];
            }

            return num;
        }
    },

    /**
     * Roll a number of dice and return the result as an array.
     *
     * @param dice Type of dice to roll, can be represented in various formats:
     *               - a number (6, 12, 42)
     *               - dice syntax (d20, 4d6, 2d8+2)
     * @return Array
     */
    verboseRoll: function(dice) {
        var amount = 1,
            mod = 0,
            results = [],
            match,
            num,
            modifiers;

        if (!dice) {
            throw new Error('Missing dice parameter.');
        }

        if (typeof dice == 'string') {
            match = dice.match(/^\s*(\d+)?\s*d\s*(\d+)\s*(.*?)\s*$/);
            if (match) {
                if (match[1]) {
                    amount = parseInt(match[1]);
                }
                if (match[2]) {
                    dice = parseInt(match[2]);
                }
                if (match[3]) {
                    modifiers = match[3].match(/([+-]\s*\d+)/g);
                    for (var i = 0; i < modifiers.length; i++) {
                        mod += parseInt(modifiers[i].replace(/\s/g, ''));
                    }
                }
            } else {
                parseInt(dice);
            }
        }

        console.log(dice)

        if (isNaN(dice)) {
            console.log("not a number")
            return "NAN";
        }

        for (var i = 0; i < amount; i++) {
            /* We dont want to ruin verbose, so we dont skip the for loop */
            if(dice !== 0){
                num = Math.floor(Math.random() * dice + 1);
            }else{
                num = 0;
            }
            results.push(num);
        }

        results = results.sort(function(a, b) {
            return a - b;
        });
        if (mod != 0) {
            results.push(mod);
        }

        return results;
    }
};

